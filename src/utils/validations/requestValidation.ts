import { ref } from 'vue';
import type { Ref } from 'vue';
import type { DermatologyRequestForm } from '@/types/request';

// Interface cho các hàm validate riêng biệt
interface ValidationRule {
    validate: (value: any) => boolean;
    errorMessage: string;
}

interface SymptomValidationResult {
    isValid: boolean;
    reason: string;
    suggestion: string;
}

// Các rules validate riêng cho từng trường
const identificationRules: ValidationRule = {
    validate: (value: string): boolean => {
        const numbersOnly = String(value).replace(/\D/g, '');
        return numbersOnly.length === 12;
    },
    errorMessage: 'Số CCCD phải đủ 12 số'
};

// Danh sách từ khóa liên quan đến da/bệnh da
const dermaKeywords = [
    'da', 'skin', 'ngứa', 'đau', 'nóng', 'rát', 'sưng', 'đỏ', 'mụn', 'vết',
    'ban', 'vảy', 'phát', 'nổi', 'mủ', 'nước', 'khô', 'ẩm', 'bong', 'tróc',
    'sẩn', 'mảng', 'chấm', 'điểm', 'vòng', 'dải', 'hình', 'màu', 'trắng', 'vàng',
    'nâu', 'đen', 'hồng', 'tím', 'bọng', 'chai', 'dày', 'mỏng', 'nứt', 'loét',
    'viêm', 'nhiễm', 'dị ứng', 'ngứa', 'bệnh', 'triệu chứng', 'tổn thương',
    'mặt', 'tay', 'chân', 'lưng', 'bụng', 'cánh tay', 'cẳng', 'bàn', 'móng',
    'tóc', 'đầu', 'cổ', 'vai', 'ngực', 'mông', 'háng', 'nách'
];

// Danh sách từ khóa ngoài phạm vi
const outOfScopeKeywords = [
    'giá', 'bao nhiêu tiền', 'chi phí', 'phí', 'bảo hiểm',
    'địa chỉ', 'phòng khám', 'bệnh viện', 'bác sĩ nào',
    'mua thuốc', 'bán thuốc', 'đặt lịch', 'hẹn'
];

export const useRequestValidation = (form: Ref<DermatologyRequestForm>) => {
    const errors = ref<Partial<Record<keyof DermatologyRequestForm, string>>>({});

    /**
     * Validate symptom description with comprehensive checks
     * Matches backend validation logic
     */
    const validateSymptom = (text: string): SymptomValidationResult => {
        const textClean = text.trim();

        // 1. Check minimum length
        if (textClean.length < 10) {
            return {
                isValid: false,
                reason: 'Mô tả quá ngắn',
                suggestion: 'Vui lòng mô tả chi tiết hơn về triệu chứng của bạn. Ví dụ: vị trí, hình dạng, màu sắc, cảm giác (ngứa, đau, nóng), thời gian xuất hiện, v.v.'
            };
        }

        // 2. Check if only special characters or numbers
        const hasOnlySpecialChars = /^[\d\s\W]+$/.test(textClean);
        if (hasOnlySpecialChars) {
            return {
                isValid: false,
                reason: 'Nội dung không hợp lệ',
                suggestion: 'Vui lòng mô tả bằng câu văn có nghĩa về tình trạng da của bạn.'
            };
        }

        // 3. Check for dermatology keywords
        const textLower = textClean.toLowerCase();
        const hasDermaKeyword = dermaKeywords.some(keyword => textLower.includes(keyword));
        if (!hasDermaKeyword) {
            return {
                isValid: false,
                reason: 'Nội dung không liên quan đến bệnh da',
                suggestion: 'Tôi là trợ lý y tế chuyên về bệnh da. Vui lòng mô tả các triệu chứng về da như: vị trí tổn thương, hình dạng, màu sắc, cảm giác (ngứa/đau/nóng), thời gian xuất hiện.'
            };
        }

        // 4. Check for vague questions
        const vaguePatterns = [
            /^(xin chào|hello|hi|chào)\s*$/i,
            /^(có ai|có người|ai đó)\s*$/i,
            /^(giúp|help|trợ giúp)\s*$/i,
            /^(bạn là ai|you are|what)\s*$/i
        ];

        for (const pattern of vaguePatterns) {
            if (pattern.test(textLower)) {
                return {
                    isValid: false,
                    reason: 'Câu hỏi quá chung chung',
                    suggestion: 'Vui lòng mô tả cụ thể triệu chứng về da của bạn. Ví dụ: "Da tôi bị ngứa và đỏ ở cánh tay, xuất hiện từ 3 ngày trước"'
                };
            }
        }

        // 5. Check word count
        const words = textClean.split(/\s+/);
        if (words.length < 5) {
            return {
                isValid: false,
                reason: 'Thông tin chưa đủ chi tiết',
                suggestion: 'Vui lòng cung cấp thêm thông tin: Vị trí bị ảnh hưởng? Triệu chứng cụ thể? Đã bao lâu? Có ngứa/đau không?'
            };
        }

        // 6. Check for spam or repetitive text
        const uniqueWords = new Set(words.map(w => w.toLowerCase()));
        const repetitionRatio = uniqueWords.size / words.length;
        if (words.length > 10 && repetitionRatio < 0.3) {
            return {
                isValid: false,
                reason: 'Nội dung không hợp lệ hoặc spam',
                suggestion: 'Vui lòng mô tả triệu chứng một cách rõ ràng, không lặp lại từ ngữ.'
            };
        }

        // 7. Check for out-of-scope keywords
        if (outOfScopeKeywords.some(keyword => textLower.includes(keyword))) {
            return {
                isValid: false,
                reason: 'Câu hỏi ngoài phạm vi tư vấn',
                suggestion: 'Tôi chỉ có thể hỗ trợ chẩn đoán sơ bộ dựa trên triệu chứng. Để biết thông tin về phòng khám, giá cả, vui lòng liên hệ trực tiếp với cơ sở y tế.'
            };
        }

        // All checks passed
        return {
            isValid: true,
            reason: 'Input hợp lệ',
            suggestion: ''
        };
    };

    // Hàm xử lý validate CCCD
    const validateIdentification = (value: string): string => {
        const numbersOnly = String(value).replace(/\D/g, '').slice(0, 12);
        if (!identificationRules.validate(numbersOnly)) {
            return identificationRules.errorMessage;
        }
        return '';
    };

    // Hàm xử lý input CCCD
    const handleIdentificationInput = (value: string | number): string => {
        const numbersOnly = String(value).replace(/\D/g, '').slice(0, 12);
        const error = validateIdentification(numbersOnly);

        // Cập nhật giá trị và lỗi
        form.value.identification = numbersOnly;
        errors.value.identification = error;

        return numbersOnly;
    };

    const validateForm = (): boolean => {
        errors.value = {};
        let isValid = true;

        // Validate name
        if (!form.value.name?.trim()) {
            errors.value.name = 'Vui lòng nhập họ tên';
            isValid = false;
        }

        // Validate age
        if (!form.value.age) {
            errors.value.age = 'Vui lòng nhập tuổi';
            isValid = false;
        }

        // Validate gender
        if (form.value.gender === '') {
            errors.value.gender = 'Vui lòng chọn giới tính';
            isValid = false;
        }

        // Validate CCCD
        const identificationError = validateIdentification(form.value.identification);
        if (identificationError) {
            errors.value.identification = identificationError;
            isValid = false;
        }

        // Validate phone
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!form.value.phone) {
            errors.value.phone = 'Vui lòng nhập số điện thoại';
            isValid = false;
        } else if (!phoneRegex.test(form.value.phone)) {
            errors.value.phone = 'Số điện thoại không hợp lệ';
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (form.value.email && !emailRegex.test(form.value.email)) {
            errors.value.email = 'Email không hợp lệ';
            isValid = false;
        }

        // Validate address
        if (!form.value.address?.trim()) {
            errors.value.address = 'Vui lòng nhập địa chỉ';
            isValid = false;
        }

        // Validate symptom - REQUIRED
        const symptomTrimmed = form.value.symptom?.trim() || '';

        if (!symptomTrimmed) {
            errors.value.symptom = 'Vui lòng nhập mô tả triệu chứng';
            isValid = false;
        } else {
            const validationResult = validateSymptom(symptomTrimmed);
            if (!validationResult.isValid) {
                // Use suggestion if available, otherwise use reason
                errors.value.symptom = validationResult.suggestion || validationResult.reason;
                isValid = false;
            }
        }

        return isValid;
    };

    const handleInput = (field: keyof DermatologyRequestForm, value: any) => {
        if (errors.value[field]) {
            errors.value[field] = '';
        }
    };

    return {
        errors,
        validateForm,
        handleInput,
        handleIdentificationInput
    };
};