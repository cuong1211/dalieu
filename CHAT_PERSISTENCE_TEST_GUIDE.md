# Chat Persistence Feature - Test Guide

## Overview
The chat persistence feature allows users to maintain their diagnosis chat session across browser refreshes and page navigation. When a user submits the form and enters the chat interface, their conversation history is automatically saved to the browser's localStorage.

## Technical Implementation

### localStorage Keys
- `diagnosis_chat_state`: Stores the complete diagnosis session object including all messages
- `show_diagnosis_chat`: Stores a boolean flag indicating whether chat mode is active

### Data Flow

```
Form Submission
    ↓
API Call to Start Diagnosis
    ↓
Initialize diagnosisSession with first AI message
    ↓
Set showChat = true
    ↓
Watch listener triggers saveChatState()
    ↓
JSON.stringify() converts objects to string
    ↓
localStorage.setItem() saves to browser storage
    ↓
[User refreshes page]
    ↓
onMounted hook calls loadChatState()
    ↓
JSON.parse() restores objects
    ↓
Timestamp strings converted back to Date objects
    ↓
diagnosisSession.value restored
    ↓
showChat.value set to true
    ↓
ChatDiagnosis component displays previous messages
```

## Test Scenarios

### Test 1: Basic Chat Persistence
**Objective**: Verify that chat data is saved and restored on page refresh

**Steps**:
1. Navigate to the Request page (Request/Diagnosis form)
2. Fill in all required form fields:
   - Họ và tên: `Nguyen Van A`
   - Tuổi: `25`
   - Giới tính: `Nam`
   - Số CCCD: `123456789012`
   - Số điện thoại: `0123456789`
   - Email: `test@example.com`
   - Địa chỉ: `123 Main Street`
   - Mô tả triệu chứng: `Red spots on skin that itch`
   - Upload an image of the symptom
3. Click "Gửi yêu cầu khám" button
4. Wait for the chat interface to load with the first AI message
5. Send a message in the chat (e.g., "Yes, I have had this for 2 weeks")
6. **Verify**: Message appears in chat with user avatar on the right side
7. Open browser Developer Tools (F12 or Ctrl+Shift+I)
8. Go to Application tab → Storage → Local Storage
9. **Verify**: Two keys exist:
   - `show_diagnosis_chat`: value should be `"true"`
   - `diagnosis_chat_state`: should contain JSON with full session data
10. Refresh the page (F5 or Ctrl+R)
11. **Verify**:
    - Chat interface appears immediately (not the form)
    - Previous messages are still visible
    - User message is displayed on the right
    - AI response is displayed on the left

### Test 2: Message Persistence Across Multiple Messages
**Objective**: Verify that multiple messages persist correctly

**Steps**:
1. Start from Test 1, step 7 (after first message)
2. Send another message (e.g., "The itching is worse at night")
3. Wait for AI response
4. Send a third message (e.g., "No medication taken yet")
5. Wait for AI response
6. Open localStorage in Dev Tools
7. **Verify**: `diagnosis_chat_state` JSON shows all 4 messages (2 user, 2 assistant)
8. Refresh the page
9. **Verify**: All 4 messages appear in the correct order

### Test 3: Date Object Handling
**Objective**: Verify that message timestamps are correctly serialized and deserialized

**Steps**:
1. Start from Test 2 after refreshing
2. Open browser console (F12)
3. Run this command to check timestamp types:
```javascript
const state = localStorage.getItem('diagnosis_chat_state');
const parsed = JSON.parse(state);
const firstMsg = parsed.diagnosisSession.messages[0];
console.log('First message timestamp:', firstMsg.timestamp);
console.log('Timestamp type:', typeof firstMsg.timestamp);
console.log('Is valid date:', !isNaN(new Date(firstMsg.timestamp).getTime()));
```
4. **Verify**:
   - timestamp is a string in ISO format (e.g., "2024-11-01T15:30:45.123Z")
   - After conversion, it's a valid date
5. **Verify in UI**: All messages display their content correctly without date format errors

### Test 4: Chat Reset and Storage Clear
**Objective**: Verify that localStorage is cleared when user resets the chat

**Steps**:
1. Start from any chat session
2. Click the reset button (↻ icon in chat header, "Bắt đầu lại")
3. **Verify**:
   - Chat disappears and form appears
   - All form fields are empty
4. Open localStorage in Dev Tools
5. **Verify**: Both `show_diagnosis_chat` and `diagnosis_chat_state` are removed from storage

### Test 5: Browser Close and Reopen
**Objective**: Verify persistence across browser window closure

**Steps**:
1. Start a chat session with at least 2 messages exchanged
2. Verify localStorage contains the data (Test 1, step 8-9)
3. Close the browser window completely (not just the tab)
4. Reopen the browser
5. Navigate back to the same Request page
6. **Verify**: Chat appears with all previous messages

### Test 6: Multiple Tabs
**Objective**: Verify behavior when opening the request in multiple tabs

**Steps**:
1. Open the Request page in Tab A
2. Start a chat and send a message
3. Open the Request page in Tab B (new tab, same URL)
4. **Verify**: Tab B shows the chat with the message from Tab A (localStorage is shared across tabs)
5. Send a message in Tab B
6. Switch to Tab A and refresh
7. **Verify**: Tab A shows both messages

### Test 7: Session Completion
**Objective**: Verify chat persistence when diagnosis is completed

**Steps**:
1. Start a chat session
2. Continue the conversation until the diagnosis completes (usually after 10 questions)
3. **Verify**: Final result section appears with top 5 diseases
4. Check localStorage
5. **Verify**: `diagnosis_chat_state` still contains all messages with `finished: true`
6. Refresh the page
7. **Verify**:
    - Chat appears with all messages
    - Final result section is still visible
    - Can click "Bắt đầu chẩn đoán mới" to reset

### Test 8: Data Corruption Recovery
**Objective**: Verify graceful handling of corrupted localStorage data

**Steps**:
1. Start a chat session and verify localStorage contains data
2. Open Developer Tools and go to Local Storage
3. Manually edit the `diagnosis_chat_state` value to introduce an error (e.g., remove a closing brace)
4. Refresh the page
5. **Verify**:
    - Page doesn't crash
    - Form appears (fallback behavior)
    - Error is logged in console: "Error loading chat state: ..."
    - User can start a new chat normally

## Expected Behavior Summary

| Action | Expected Result |
|--------|-----------------|
| Form submission | showChat = true, saveChatState() called, data stored in localStorage |
| Send message | diagnosisSession updated, watch triggers save |
| Page refresh | loadChatState() restores previous session |
| Reset button | clearChatState() removes storage keys, form appears |
| Browser reload | localStorage persists (browser standard), chat restored |
| Multiple tabs | All tabs access same localStorage data |
| Diagnosis complete | Chat persists with finished flag = true |
| Corrupted data | Graceful fallback to form, error logged |

## Debugging Tips

### Check localStorage contents:
```javascript
// In browser console
console.log(localStorage.getItem('diagnosis_chat_state'));
console.log(localStorage.getItem('show_diagnosis_chat'));
```

### Monitor save operations:
1. Add a breakpoint in Vue DevTools on the `saveChatState` function
2. Check the Network tab to see API calls
3. Verify localStorage updates after each message

### Check message timestamps:
```javascript
const state = JSON.parse(localStorage.getItem('diagnosis_chat_state'));
state.diagnosisSession.messages.forEach((msg, i) => {
    console.log(`Message ${i}:`, msg.role, '|', new Date(msg.timestamp).toLocaleString());
});
```

## Known Limitations

1. **Storage Size**: localStorage has a limit (~5-10MB depending on browser). Large sessions with many images may exceed this.
2. **Cross-domain**: localStorage is domain-specific. Different domains won't share data.
3. **Private Browsing**: Some browsers don't allow localStorage in private/incognito mode.
4. **Session Life**: Data persists until user manually clears browser cache or calls clearChatState().

## Browser Compatibility

The localStorage implementation uses standard Web APIs supported in:
- Chrome/Edge 4+
- Firefox 3.5+
- Safari 4+
- IE 8+
- All modern mobile browsers

