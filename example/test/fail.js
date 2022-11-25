import { test } from 'tapzero'
import '@nichoth/tap-ssc/test-context'

test('failing tests', t => {
    t.fail('example failure')
})
