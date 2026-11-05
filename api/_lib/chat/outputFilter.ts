// Enforces the chat's format rules on the reply as it streams, so a prompt slip never reaches the
// visitor: no em or en dashes, no list markers, no headers, no bold. The model's raw reply is stored
// unfiltered for replay (editing it would invalidate the replayed thinking blocks); only what the
// visitor sees passes through here. Deltas arrive in arbitrary chunks, so decisions that need the
// next character (a dash, a line start, a lone "*") are held back until it arrives.

export const LENGTH_GUARD_CHARS = 700

const DASHES = new Set(['—', '–']) // em, en
const SENTENCE_END = new Set(['.', '!', '?'])
const isDigit = (c: string) => c >= '0' && c <= '9'
const isSpace = (c: string) => c === ' ' || c === '\t'

// What may still turn into a marker at the start of a line, and what confirms one
const MARKER_SO_FAR = /^[ \t]*(?:[-*•]|\d{1,2}[.)]?|#{1,6})?$/
const MARKER_DONE = /^[ \t]*(?:[-*•]|\d{1,2}[.)]|#{1,6})[ \t]$/

export interface FilterStats {
  dashes: number
  markers: number
  bold: number
  lengthGuard: boolean
}

export class OutputFilter {
  readonly stats: FilterStats = { dashes: 0, markers: 0, bold: 0, lengthGuard: false }
  private shown = ''
  private out = ''
  private atLineStart = true
  private lineBuf = ''
  private pendingSpaces = ''
  private skipSpaces = false
  private starPending = false
  private starSpaces = ''
  private dash: { char: string; spaceBefore: boolean; spaceAfter: boolean } | null = null

  constructor(private readonly limit = LENGTH_GUARD_CHARS) {}

  /** Everything the visitor has been shown so far */
  get text(): string {
    return this.shown
  }

  /** Feeds a model delta; returns the text that is safe to show now */
  push(delta: string): string {
    this.out = ''
    for (const c of delta) this.feed(c)
    return this.out
  }

  /** Releases anything held back at the end of the reply */
  flush(): string {
    this.out = ''
    if (this.atLineStart && this.lineBuf) this.releaseLine()
    if (this.dash) this.resolveDash('')
    if (this.starPending) this.emit(this.starSpaces + '*')
    this.starPending = false
    this.pendingSpaces = ''
    this.shown = this.shown.trimEnd()
    return this.out.trimEnd()
  }

  private feed(c: string): void {
    if (this.atLineStart && c !== '\n') {
      this.lineBuf += c
      if (MARKER_DONE.test(this.lineBuf)) {
        this.stats.markers++
        this.lineBuf = ''
        this.atLineStart = false
        this.skipSpaces = true
      } else if (!MARKER_SO_FAR.test(this.lineBuf)) {
        this.releaseLine()
      }
      return
    }
    this.handle(c)
  }

  // The held line start turned out to be ordinary text: run it through the normal path
  private releaseLine(): void {
    const held = this.lineBuf
    this.lineBuf = ''
    this.atLineStart = false
    for (const c of held) this.handle(c)
  }

  private handle(c: string): void {
    if (c === '\n') {
      if (this.dash) this.resolveDash('\n')
      if (this.starPending) this.emit(this.starSpaces + '*')
      this.starPending = false
      this.pendingSpaces = ''
      this.skipSpaces = false
      this.emit('\n')
      this.atLineStart = true
      return
    }
    if (isSpace(c)) {
      if (this.dash) this.dash.spaceAfter = true
      else if (!this.skipSpaces) this.pendingSpaces += c
      return
    }
    if (DASHES.has(c)) {
      this.stats.dashes++
      this.dash = { char: c, spaceBefore: this.pendingSpaces.length > 0, spaceAfter: false }
      this.pendingSpaces = ''
      return
    }
    if (this.dash) this.resolveDash(c)
    if (c === '*') {
      if (this.starPending) {
        // "**": drop both stars, keep the spacing that came before them
        this.stats.bold++
        this.starPending = false
        this.pendingSpaces = this.starSpaces
      } else {
        this.starPending = true
        this.starSpaces = this.pendingSpaces
        this.pendingSpaces = ''
      }
      return
    }
    if (this.starPending) {
      this.starPending = false
      this.emit(this.starSpaces + '*')
    }
    this.emit(this.pendingSpaces + c)
    this.pendingSpaces = ''
    this.skipSpaces = false
  }

  // "2–4" keeps a plain hyphen; any other dash becomes a comma pause
  private resolveDash(next: string): void {
    const dash = this.dash!
    this.dash = null
    const last = this.shown.at(-1) ?? ''
    if (
      dash.char === '–' &&
      !dash.spaceBefore &&
      !dash.spaceAfter &&
      isDigit(last) &&
      isDigit(next)
    ) {
      this.emit('-')
      return
    }
    // Nothing to join: at a line start, or right before other punctuation, the dash just goes
    if (last === '' || last === '\n' || SENTENCE_END.has(next) || next === ',') return
    if (last !== ',') this.emit(',')
    if (next !== '' && next !== '\n') this.emit(' ')
  }

  private emit(s: string): void {
    for (const c of s) {
      if (this.stats.lengthGuard) return
      this.shown += c
      this.out += c
      // Past the limit, stop at the next sentence end rather than mid-sentence
      if (this.shown.length >= this.limit && SENTENCE_END.has(c)) this.stats.lengthGuard = true
    }
  }
}
