import { describe, expect, it } from 'vitest'
import { OutputFilter } from './outputFilter.js'

// Runs text through the filter in the given chunks, the way stream deltas arrive
function run(chunks: string[], limit?: number) {
  const filter = new OutputFilter(limit)
  const shown = chunks.map(chunk => filter.push(chunk)).join('') + filter.flush()
  return { shown, filter }
}

describe('OutputFilter', () => {
  it('turns em and en dashes into comma pauses', () => {
    expect(run(['I build products — end to end.']).shown).toBe('I build products, end to end.')
    expect(run(['Fast—and reliable']).shown).toBe('Fast, and reliable')
    expect(run(['Yes – happy to']).shown).toBe('Yes, happy to')
  })

  it('handles a dash split across chunks', () => {
    expect(run(['It works ', '—', ' mostly.']).shown).toBe('It works, mostly.')
  })

  it('keeps numeric ranges as a hyphen', () => {
    expect(run(['Usually 2–4 weeks.']).shown).toBe('Usually 2-4 weeks.')
  })

  it('does not double a comma or leave one before other punctuation', () => {
    expect(run(['Sure, — why not']).shown).toBe('Sure, why not')
    expect(run(['That is it —.']).shown).toBe('That is it.')
  })

  it('strips list markers at line starts, including split ones', () => {
    expect(run(['Two things:\n- React\n- Node']).shown).toBe('Two things:\nReact\nNode')
    expect(run(['Steps:\n1', '. Plan\n2. Build']).shown).toBe('Steps:\nPlan\nBuild')
    expect(run(['• one']).shown).toBe('one')
  })

  it('leaves hyphens and numbers inside sentences alone', () => {
    const text = 'I shipped 5 full-stack apps in 2024. 10 of them? No.'
    expect(run([text]).shown).toBe(text)
  })

  it('removes bold markers and headers', () => {
    expect(run(['I use **React** a lot']).shown).toBe('I use React a lot')
    expect(run(['## Stack\nTypeScript']).shown).toBe('Stack\nTypeScript')
    expect(run(['2 * 3 = 6']).shown).toBe('2 * 3 = 6')
  })

  it('counts what it changed', () => {
    const { filter } = run(['A — b\n- c **d**'])
    expect(filter.stats).toMatchObject({ dashes: 1, markers: 1, bold: 2 })
  })

  it('stops at the first sentence end past the length guard', () => {
    const { shown, filter } = run(['One two three. Four five six. Seven.'], 10)
    expect(shown).toBe('One two three.')
    expect(filter.stats.lengthGuard).toBe(true)
    expect(filter.text).toBe(shown)
  })

  it('trims trailing whitespace', () => {
    expect(run(['Hey!  ', ' ']).shown).toBe('Hey!')
  })
})
