import { test } from '@nichoth/tapzero'

test('browser environment', t => {
    t.ok(window, 'window should exist')
})
