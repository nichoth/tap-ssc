import { test } from 'tapzero'

test('browser environment', t => {
    t.ok(window, 'window should exist')
})
