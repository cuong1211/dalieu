import axios from 'axios';
import type { Disease } from '@/types/diseases';

// API endpoint for diseases database
const API_BASE_URL = import.meta.env.VITE_API_DF;

/**
 * Service để xử lý API diseases
 */
class DiseasesService {
    /**
     * Lấy thông tin bệnh theo code
     * @param code - Code của bệnh (ví dụ: "04" cho acne)
     * @returns Disease data với treatment và prevention
     */
    async getDiseaseByCode(code: string): Promise<Disease | null> {
        try {
            const response = await axios.get<{ data: Disease[] }>(
                `${API_BASE_URL}/diseases`,
                {
                    params: {
                        code: code
                    }
                }
            );

            // Return first result or null
            if (response.data.data && response.data.data.length > 0) {
                return response.data.data[0];
            }
            return null;
        } catch (error) {
            console.error(`Error fetching disease with code ${code}:`, error);
            return null;
        }
    }

    /**
     * Lấy thông tin nhiều bệnh theo danh sách codes
     * @param codes - Danh sách codes của bệnh
     * @returns Promise<Disease[]>
     */
    async getDiseasesByMultipleCodes(codes: string[]): Promise<Disease[]> {
        try {
            const diseasePromises = codes.map(code => this.getDiseaseByCode(code));
            const diseases = await Promise.all(diseasePromises);
            // Filter out null values
            return diseases.filter(disease => disease !== null) as Disease[];
        } catch (error) {
            console.error('Error fetching multiple diseases:', error);
            return [];
        }
    }

    /**
     * Trích xuất phần treatment từ HTML (bỏ phần "Nguyên tắc điều trị")
     * @param treatmentHTML - HTML content của treatment
     * @returns Plain text treatment without "Nguyên tắc điều trị" section
     */
    extractTreatmentContent(treatmentHTML: string): string {
        if (!treatmentHTML) return '';

        // Convert HTML to plain text
        const text = treatmentHTML
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .trim();

        // Remove "Nguyên tắc điều trị:" section (first occurrence up to next major section)
        const lines = text.split('\n');
        const filteredLines = lines.filter(line => {
            const trimmedLine = line.trim();
            // Skip the "Nguyên tắc điều trị:" line and the line that follows (dash-separated)
            return !trimmedLine.includes('Nguyên tắc điều trị') && trimmedLine.length > 0;
        });

        // Join and clean up extra whitespace
        return filteredLines
            .join('\n')
            .replace(/\n{2,}/g, '\n') // Remove multiple newlines
            .trim();
    }

    /**
     * Trích xuất phần prevention từ HTML
     * @param preventionHTML - HTML content của prevention
     * @returns Plain text prevention
     */
    extractPreventionContent(preventionHTML: string): string {
        if (!preventionHTML) return '';

        // Convert HTML to plain text
        return preventionHTML
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/\n{2,}/g, '\n') // Remove multiple newlines
            .trim();
    }
}

export default new DiseasesService();
