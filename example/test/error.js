// @ts-check
import { test } from 'tapzero'
import '@nichoth/tap-ssc/test-context'

test('example err', t => {
    throw new Error('example error')
})
