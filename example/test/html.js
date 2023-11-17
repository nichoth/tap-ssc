import { test } from '@nichoth/tapzero'

test('can pass in an html file', t => {
    t.ok(document.getElementById('hurray'), 'should get our custom html')
})
