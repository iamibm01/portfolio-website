import { describe, expect, it } from 'vitest'
import { dbTarget, errorFields } from './log.js'

describe('dbTarget', () => {
  it('keeps the host label and database name, never the credentials', () => {
    const target = dbTarget('postgresql://user:secret@ep-a-b-pooler.c-1.aws.neon.tech/neondb?x=1')
    expect(target).toEqual({ dbHost: 'ep-a-b-pooler', dbName: 'neondb' })
    expect(JSON.stringify(target)).not.toContain('secret')
  })

  it('does not echo a value it cannot parse', () => {
    expect(dbTarget('psql user:secret@host')).toEqual({
      dbHost: 'unparseable',
      dbName: 'unparseable',
    })
  })
})

class PrismaClientKnownRequestError extends Error {
  code = 'P2021'
  meta = {
    driverAdapterError: {
      cause: {
        kind: 'TableDoesNotExist',
        originalCode: '42P01',
        originalMessage: 'password authentication failed for postgres://user:secret@host/db',
      },
    },
  }
}

describe('errorFields', () => {
  it('keeps the class, Prisma code and driver error kind', () => {
    expect(errorFields(new PrismaClientKnownRequestError('boom'))).toEqual({
      error: 'PrismaClientKnownRequestError',
      prismaCode: 'P2021',
      dbErrorKind: 'TableDoesNotExist',
      dbErrorCode: '42P01',
    })
  })

  it('never includes the message or driver message', () => {
    const logged = JSON.stringify(
      errorFields(new PrismaClientKnownRequestError('jane@example.com'))
    )
    expect(logged).not.toContain('jane@example.com')
    expect(logged).not.toContain('secret')
  })

  it('drops values that are not short identifiers', () => {
    const error = Object.assign(new Error('x'), { code: 'postgres://user:secret@host/db' })
    expect(errorFields(error)).toEqual({ error: 'Error' })
  })

  it('handles errors that are not objects', () => {
    expect(errorFields('nope')).toEqual({ error: 'string' })
    expect(errorFields(null)).toEqual({ error: 'object' })
  })
})
