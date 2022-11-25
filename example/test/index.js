import { test } from 'tapzero'
import '@nichoth/tap-ssc/test-context'

test('browser environment', t => {
    t.ok(window, 'window should exist')
})
