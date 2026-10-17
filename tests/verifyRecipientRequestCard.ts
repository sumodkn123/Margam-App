import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const card = readFileSync('src/components/cards/RecipientRequestCard.tsx', 'utf8');
const incoming = readFileSync('src/screens/IncomingRequestsScreen.tsx', 'utf8');

assert(card.includes('Review full introduction'), 'request details should be expandable');
assert(card.includes('accessibilityState={{ expanded: isExpanded }}'), 'expand control should expose accessibility state');
assert(card.includes('Only details selected for this request are shown'), 'collapsed card should explain privacy');
assert(!card.includes('☕ 5 Shared Margams'), 'must not invent shared Margam counts');
assert(!card.includes('🎯 3 Common Goals'), 'must not invent shared goal counts');
assert(!card.includes('Similar marriage timeline horizon'), 'must not invent compatibility reasons');
assert(card.includes('request.selectedInterestReasons.map'), 'reasons must come from request data');
assert(incoming.includes('Private details remain protected until shared with consent.'), 'acceptance toast must not imply private data is unlocked');
assert(!incoming.includes('Stage 3 permissions unlocked'), 'remove misleading automatic permission claim');

console.log('Recipient request card regression checks passed.');
