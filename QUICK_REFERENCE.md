# Quick Reference - Chat Persistence Feature

## What Was Implemented?

### Problem Solved
Users were losing their diagnosis chat history when refreshing the page or navigating away.

### Solution
Implemented browser localStorage to automatically save and restore chat sessions.

---

## How It Works (In Simple Terms)

### When User Submits Form:
```
1. Form submission → Diagnosis starts
2. showChat flag changes to true
3. Auto-watch triggers → Saves to localStorage
4. User sees chat interface with AI messages
```

### When User Refreshes Page:
```
1. Page reloads
2. Component mounts → Checks localStorage
3. If chat data found → Restores it
4. User sees same chat with all previous messages
5. Can continue conversation from where they left off
```

### When User Clicks Reset:
```
1. Reset button clicked → Back to form
2. Clears localStorage
3. Form fields empty and ready for new session
```

---

## Code Locations

### Main Implementation File
**Location**: `src/views/frontend/Request/RequestView.vue` (Lines 128-207)

**Key Functions**:
| Function | Lines | Purpose |
|----------|-------|---------|
| `saveChatState()` | 146-157 | Saves chat to localStorage |
| `loadChatState()` | 160-181 | Restores chat from localStorage |
| `clearChatState()` | 184-191 | Deletes chat from localStorage |
| `watch()` | 194-202 | Auto-save on data changes |
| `onMounted()` | 205-207 | Auto-restore on page load |
| `handleReset()` | Line 378 | Clear storage when reset |

### Storage Keys
```typescript
const CHAT_STATE_KEY = 'diagnosis_chat_state';      // Full session data
const SHOW_CHAT_KEY = 'show_diagnosis_chat';        // Chat active flag
```

---

## Testing the Feature

### Quick Test (30 seconds)
1. Fill form and submit
2. Send a message in chat
3. Refresh page (F5)
4. ✅ Chat appears with your message

### Verify Storage (in Browser DevTools)
1. Press F12 to open DevTools
2. Go to: Application → Storage → Local Storage
3. Look for your domain name
4. You should see two keys:
   - `show_diagnosis_chat` = `"true"`
   - `diagnosis_chat_state` = JSON data

### Test Reset
1. Click reset button (↻)
2. Form appears
3. Open LocalStorage again
4. ✅ Both keys should be deleted

---

## Important Implementation Details

### Date Handling
Messages have timestamps. These are handled specially:
- **Save**: JavaScript Date object → ISO string (automatic)
- **Load**: ISO string → JavaScript Date object (manual conversion)

```typescript
// In loadChatState(), we convert timestamps:
timestamp: new Date(msg.timestamp)  // "2024-11-01T15:30:45Z" → Date object
```

### Error Safety
All storage operations protected with try-catch:
- If localStorage full → Error logged, session continues normally
- If data corrupted → Error logged, fallback to form
- User never sees crashes

### Performance
- Saves only when chat is active
- Uses Vue's built-in watch optimization
- No continuous polling
- Minimal memory overhead

---

## Browser Requirements

✅ Works in:
- Chrome, Firefox, Safari, Edge
- Mobile browsers
- All versions from 2009+

⚠️ Issues with:
- Private/Incognito mode (depends on browser)
- Very old browsers (IE 7 or older)
- Custom browser settings (storage disabled)

---

## Storage Capacity

- Typical limit: 5MB per domain
- Actual chat data: ~10-50KB per session
- Support for: ~100-500 chat sessions per domain

---

## What Gets Saved

✅ Saved automatically:
- All messages (user + AI)
- Message content
- Message timestamps
- Message roles (who said it)
- Detected symptoms list
- Top 5 disease predictions
- Session ID
- Progress counter (questions asked/max)
- Finished status

❌ NOT saved:
- Form input fields (only chat)
- User personal information (name, phone, etc.)
- Session expires on reset or manual clear

---

## Debugging

### Check if data is saved
```javascript
// In browser console (F12)
localStorage.getItem('show_diagnosis_chat')
localStorage.getItem('diagnosis_chat_state')
```

### Monitor save operations
1. Open Console (F12)
2. You'll see messages like:
   - "Error saving chat state: ..." (if error)
   - "Error loading chat state: ..." (if error)
3. No message = working silently (normal)

### View all chat messages in storage
```javascript
const state = JSON.parse(localStorage.getItem('diagnosis_chat_state'));
console.table(state.diagnosisSession.messages);
```

---

## User Workflow

```
[User Fills Form] → [Submits] → [Chat Opens]
                                    ↓
                            [Message Sent]
                                    ↓
                            [Auto-Saved] ← Happens invisibly
                                    ↓
                            [User Refreshes]
                                    ↓
                            [Chat Restored]
                                    ↓
                        [Continue Conversation]
                                    ↓
                            [Click Reset]
                                    ↓
                            [Data Cleared]
                                    ↓
                          [Back to Fresh Form]
```

---

## Common Questions

### Q: Where is data saved?
A: In the browser's localStorage on the user's computer. Not on server.

### Q: Will data persist across devices?
A: No, each device has its own localStorage. For cross-device support, server-side storage would be needed.

### Q: What happens if user clears browser cache?
A: localStorage is usually cleared. Chat history would be lost.

### Q: Can I export the chat?
A: Not currently. Future enhancement could add export feature.

### Q: Is data encrypted?
A: No, it's plaintext in localStorage. For sensitive data, encryption could be added.

### Q: Will it slow down the app?
A: No, impact is minimal. Watch debouncing and conditional saving prevent performance issues.

---

## Files to Review

For more details, see:
1. **IMPLEMENTATION_SUMMARY.md** - Complete technical details
2. **CHAT_PERSISTENCE_TEST_GUIDE.md** - Comprehensive test cases
3. **src/views/frontend/Request/RequestView.vue** - Source code

---

## Support

If chat doesn't persist:
1. Check browser localStorage is enabled
2. Open DevTools → Console for error messages
3. Verify you have space in localStorage (not full)
4. Try a different browser
5. Clear browser cache and try again

