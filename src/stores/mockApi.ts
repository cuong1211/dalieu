// services/mockApi.ts
import type { RequestResponse } from '@/types/request';
import type { DermatologyRequestForm } from '@/types/request';

export const mockApiService = {
  submitRequest: async (formData: DermatologyRequestForm): Promise<RequestResponse> => {
    // Giả lập delay API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      message: "Thêm mới bệnh nhân thành công",
      data: {
        name: formData.name,
        age: "21",
        gender: formData.gender,
        phone: formData.phone,
        address: formData.address,
        symptom: formData.symptoms,
        info: {
          sub: [[
            {
              id: 5,
              name: "Nhọt"
            }
          ]]
        },
        result: "Hệ thống chẩn đoán bạn có thể liên quan tới các bệnh: Nhọt.",
        image: "77552591-fba8-4a2a-9b8a-c65fc86c5e86"
      }
    };
  }
};