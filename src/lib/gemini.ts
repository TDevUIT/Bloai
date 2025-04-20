import { env } from '@/env'
import { GoogleGenerativeAI } from '@google/generative-ai' 

const genAI = new GoogleGenerativeAI(env.GOOGLE_GEMINI_API)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
// gemini-1.5-pro 
const generateSEOContent = async (prompt: string): Promise<string | null> => {
  try {
    console.log('--- Sending Prompt to AI ---');
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    if (!result || !result.response || !result.response.text()) {
       console.error('AI Generation Error: No text in response or response blocked.');
       console.error('AI Response Error Details:', result?.response?.promptFeedback);
       if (result?.response?.candidates) {
           console.error('AI Response Candidate Error:', JSON.stringify(result.response.candidates, null, 2));
       }
       return null;
    }

    let text = result.response.text();

    console.log('--- Received AI Response ---');

    text = text.trim(); 

    const startMarkers = [
      '```markdown\n',
      '```markdown ',
      '```json\n',
      '```json ',
      '```text\n',
      '```text ',
      '```\n', 
      '``` ',  
      '```',   
    ];

    for (const marker of startMarkers) {
        if (text.startsWith(marker)) {
            text = text.substring(marker.length).trimStart();
            break;
        }
    }

    const endMarkers = [
      '\n```',
      ' ```', 
      '```',   
    ];

     for (const marker of endMarkers) {
        if (text.endsWith(marker)) {
            text = text.substring(0, text.length - marker.length).trimEnd();
            break;
        }
    }

    text = text.trim(); 


    return text;

  } catch (error: any) {
    console.error('AI Generation Error:', error?.message || error);
    if (error.response) {
      console.error('AI Response Error Details:', JSON.stringify(error.response.promptFeedback, null, 2));
       if (error.response.candidates) {
           console.error('AI Response Candidate Error:', JSON.stringify(error.response.candidates, null, 2));
       }
    }
    return null;
  }
}
// export const aiGenerateSEOTags = async (content: string): Promise<string | null> => {
//   const prompt = `
//     **Mục tiêu:** Tạo bộ thẻ meta keywords TỐI ƯU NHẤT để bài viết này có khả năng ĐỨNG TOP 1 Google tại Việt Nam.

//     **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
//     "${content}"

//     **Yêu cầu NGHIÊM NGẶT (TUYỆT ĐỐI tuân thủ):**
//     1.  **Số lượng:** CHÍNH XÁC 7 thẻ từ khóa. KHÔNG HƠN, KHÔNG KÉM.
//     2.  **Định dạng:** Chỉ gồm các từ khóa viết thường, phân tách BẰNG DUY NHẤT dấu phẩy (","). KHÔNG có khoảng trắng THỪA trước/sau dấu phẩy (trừ khoảng trắng TỰ NHIÊN giữa các từ trong một cụm từ khóa). KHÔNG giải thích. KHÔNG markdown. KHÔNG số thứ tự.
//     3.  **Cấu trúc (Ước tính, dựa trên nội dung):**
//         *   2 từ khóa chính (1-2 từ, cốt lõi nhất RÚT RA TỪ NỘI DUNG).
//         *   3 từ khóa phụ (2-3 từ, mở rộng chủ đề, liên quan chặt chẽ NỘI DUNG).
//         *   2 cụm từ khóa đuôi dài (4-5 từ, giải quyết ý định cụ thể, chi tiết NỘI DUNG).
//     4.  **Tối ưu hóa (Dựa trên NỘI DUNG):**
//         *   Dựa trên các thuật ngữ/khái niệm NỔI BẬT trong nội dung đã cho.
//         *   Kết hợp các biến thể từ khóa ngữ nghĩa tiếng Việt (từ đồng nghĩa, khái niệm liên quan).
//         *   Ưu tiên các từ khóa có khả năng được người dùng Việt Nam tìm kiếm (dựa trên văn phong nội dung).
//     5.  **Giới hạn Ký tự:** Tổng độ dài TẤT CẢ các thẻ (bao gồm cả dấu phẩy và khoảng trắng sau dấu phẩy) KHÔNG ĐƯỢC VƯỢT QUÁ 160 ký tự. Hãy đếm kỹ.
//     6.  **Loại trừ Tuyệt đối:** Các cụm từ bị cấm: "tốt nhất", "hàng đầu", "hướng dẫn".
//     7.  **Ngôn ngữ:** Sử dụng từ ngữ người Việt Nam thường tìm kiếm, PHẢI LIÊN QUAN ĐẾN NỘI DUNG.

//     **Đầu ra CHỈ và CHỈ gồm chuỗi 7 từ khóa theo định dạng yêu cầu. KHÔNG BẤT KỲ THÔNG TIN NÀO KHÁC.**

//     **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
//     react development,component architecture,state management,performance optimization,react hooks best practices,redux toolkit configuration,tối ưu react app
//     ---END---
//   `;
//   return generateSEOContent(prompt);
// }

export const aiGenerateMetaDescription = async (content: string, generatedKeywords: string = ''): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT mô tả meta DUY NHẤT, cực kỳ hấp dẫn, tối ưu SEO, và thôi thúc người dùng nhấp vào KHI XUẤT HIỆN TRÊN GOOGLE.

    **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
    "${content}"

    **Các từ khóa quan trọng đã được xác định (Ưu tiên sử dụng nếu phù hợp):**
    ${generatedKeywords ? generatedKeywords : "Không có từ khóa ưu tiên."}

    **Yêu cầu TUYỆT ĐỐI (NGHIÊM NGẶT tuân thủ):**
    1.  **Độ dài:** CHÍNH XÁC trong khoảng 157-160 ký tự. Đây là yêu cầu QUAN TRỌNG NHẤT. Hãy đếm ký tự của đầu ra cuối cùng để đảm bảo. Mọi kết quả ngoài khoảng này sẽ bị TỪ CHỐI.
    2.  **Cấu trúc 3 phần RÕ RỆT (Dựa trên NỘI DUNG và ưu tiên từ khóa):**
        *   Phần 1 (Khoảng 60-70 ký tự): [Động từ mạnh mẽ, cuốn hút tiếng Việt] + [Từ khóa chính cốt lõi RÚT RA TỪ NỘI DUNG, **ưu tiên từ danh sách đã cho**] + [Số liệu/Giá trị cụ thể NẾU CÓ TRONG NỘI DUNG] + [Lợi ích trực tiếp RÚT RA TỪ NỘI DUNG]. Từ khóa chính PHẢI xuất hiện trong 10 từ đầu.
        *   Phần 2 (Khoảng 70-80 ký tự): [Từ khóa phụ liên quan ĐẾN NỘI DUNG, **ưu tiên từ danh sách đã cho**] + [Giải pháp/Cách thức ĐỀ CẬP TRONG NỘI DUNG] + [Yếu tố thời gian/Cập nhật (vd: năm ${new Date().getFullYear()})].
        *   Phần 3 (Khoảng 20-25 ký tự): [CTA thôi thúc hành động bằng tiếng Việt tự nhiên, rõ ràng].
    3.  **Từ ngữ:**
        *   Động từ mạnh gợi ý: Làm chủ | Khám phá | Nâng tầm | Bí quyết | Tối ưu | Giải mã... (chọn từ phù hợp nhất với NỘI DUNG).
        *   Loại bỏ hoàn toàn các từ đệm không cần thiết.
        *   Sử dụng ngôn ngữ tự nhiên, lôi cuốn người đọc Việt.
    4.  **Xác thực Cuối cùng (Kiểm tra trước khi đưa ra đầu ra):**
        *   Kiểm tra lại SỐ KÝ TỰ LẦN CUỐI (PHẢI trong khoảng 157-160).
        *   Đảm bảo có CTA rõ ràng ở cuối.
        *   Từ khóa chính xuất hiện sớm (trong 10 từ đầu).
        *   Có năm hiện tại (${new Date().getFullYear()}).
        *   **Đảm bảo đã ưu tiên sử dụng từ khóa từ danh sách được cung cấp nếu phù hợp.**
    5.  **Định dạng:** CHỈ trả về DUY NHẤT một chuỗi mô tả meta. KHÔNG giải thích. KHÔNG markdown. KHÔNG kèm theo số ký tự.

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    Làm chủ 7 kỹ thuật tối ưu React ${new Date().getFullYear()} giúp giảm tải trang 50%. Khám phá bí quyết cho component và quản lý state hiệu quả, tăng tốc ứng dụng ngay hôm nay. Click xem!
    ---END---
  `;
  return generateSEOContent(prompt);
}

export const aiGenerateSEOKeywords = async (content: string, existingKeywords: string[] = []): Promise<string | null> => {
  const existingKeywordsString = existingKeywords.join(', ');
  const prompt = `
    **Mục tiêu:** Tạo danh sách từ khóa SEO chiến lược giúp nội dung bao phủ tối đa các truy vấn tìm kiếm liên quan của người dùng Việt Nam. Danh sách từ khóa này nên bao gồm cả các từ khóa quan trọng từ database hiện có của tôi nếu chúng phù hợp với nội dung.

    **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
    "${content}"

    **Danh sách từ khóa ưu tiên từ Database (Nếu có):**
    ${existingKeywordsString ? existingKeywordsString : "Không có danh sách ưu tiên."}

    **Yêu cầu CHÍNH XÁC (TUYỆT ĐỐI tuân thủ):**
    1.  **Số lượng:** ĐÚNG 15 từ khóa. KHÔNG HƠN, KHÔNG KÉM.
    2.  **Định dạng:** Viết thường, phân tách BẰNG DUY NHẤT dấu phẩy (","). KHÔNG có khoảng trắng THỪA trước/sau dấu phẩy. KHÔNG giải thích. KHÔNG markdown.
    3.  **Cấu trúc (Ước tính, Dựa trên NỘI DUNG):**
        *   Ưu tiên sử dụng các từ khóa trong "Danh sách từ khóa ưu tiên từ Database" NẾU CHÚNG THỰC SỰ LIÊN QUAN và PHÙ HỢP với nội dung đã cho. Không sử dụng từ khóa ưu tiên nếu không liên quan.
        *   Sau khi đã sử dụng các từ khóa ưu tiên phù hợp, hãy tạo thêm các từ khóa mới (đuôi ngắn, đuôi vừa, đuôi dài - theo phân bổ tỷ lệ ước tính dưới đây) dựa trên phân tích nội dung để đạt đủ số lượng 15.
        *   Phân bổ tỷ lệ cho TOÀN BỘ 15 từ khóa (sau khi đã tính các từ khóa ưu tiên được sử dụng):
            *   ~40% đuôi ngắn (1 từ): Từ khóa cốt lõi NỔI BẬT TRONG NỘI DUNG, volume cao (ước tính).
            *   ~40% đuôi vừa (2-4 từ): Từ khóa cụ thể hơn, thể hiện ý định rõ hơn, liên quan chặt chẽ NỘI DUNG.
            *   ~20% đuôi dài (1-2 từ): Từ khóa rất cụ thể, giải quyết nhu cầu chi tiết, thường là câu hỏi LIÊN QUAN ĐẾN NỘI DUNG.
    4.  **Chất lượng & Đa dạng (Dựa trên NỘI DUNG và danh sách ưu tiên):**
        *   Bao gồm từ khóa LSI ngữ nghĩa tiếng Việt (liên quan về mặt ý nghĩa ĐẾN NỘI DUNG).
        *   Kết hợp các từ/cụm từ thể hiện ý định người dùng Việt Nam ('cách', 'hướng dẫn', 'là gì', 'so sánh', 'đánh giá', 'mẹo', 'bí quyết', 'cho người mới bắt đầu', 'nâng cao'...) NẾU PHÙ HỢP VỚI NỘI DUNG.
        *   Thêm yếu tố mới mẻ nếu phù hợp và LIÊN QUAN ĐẾN NỘI DUNG ('${new Date().getFullYear()}', 'mới nhất', 'cập nhật').
        *   Ưu tiên các từ khóa có lượng tìm kiếm ước tính tốt tại thị trường Việt Nam (dựa trên văn phong nội dung).
    5.  ** Loại trừ Tuyệt đối:**
        *   Từ khóa gốc bị lặp lại một cách không cần thiết trong danh sách 15 cuối cùng.
        *   Thuật ngữ thương hiệu của đối thủ cạnh tranh (trừ khi nội dung so sánh trực tiếp).
        *   Bất kỳ từ khóa nào trong danh sách 15 cuối cùng KHÔNG LIÊN QUAN ĐẾN NỘI DUNG đã cho.
    6.  **Nhóm:** Cố gắng nhóm các từ khóa liên quan gần nhau một cách tự nhiên trong danh sách 15 cuối cùng.

    **Đầu ra CHỈ và CHỈ gồm chuỗi 15 từ khóa theo định dạng yêu cầu. KHÔNG BẤT KỲ THÔNG TIN NÀO KHÁC.**

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    react development,component architecture,state management,performance optimization,react hooks best practices,redux toolkit configuration,tối ưu react app,từ khóa cũ 1,từ khóa cũ 2,... (Đủ 15 từ)
    ---END---
  `;
  return generateSEOContent(prompt);
}

export const aiGenerateOpenGraphTitle = async (content: string, generatedKeywords: string = ''): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT tiêu đề Open Graph (og:title) CỰC KỲ THU HÚT, khiến người dùng muốn nhấp vào khi thấy bài viết được chia sẻ trên Facebook, Zalo, Twitter...

    **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
    "${content}"

    **Các từ khóa quan trọng đã được xác định (Ưu tiên sử dụng nếu phù hợp):**
    ${generatedKeywords ? generatedKeywords : "Không có từ khóa ưu tiên."}

    **Yêu cầu TUYỆT ĐỐI (NGHIÊM NGẶT tuân thủ):**
    1.  **Độ dài:** CHÍNH XÁC trong khoảng 68-72 ký tự. Đây là yêu cầu QUAN TRỌNG. Hãy đếm kỹ độ dài của đầu ra cuối cùng.
    2.  **Nội dung (Dựa trên NỘI DUNG và ưu tiên từ khóa):**
        *   Phải chứa Từ khóa chính VÀ Từ khóa phụ quan trọng ĐƯỢC RÚT RA TỪ NỘI DUNG, **ưu tiên các từ phù hợp từ danh sách đã cho.**
        *   Bao gồm 1 emoji LIÊN QUAN TINH TẾ ở đầu hoặc cuối (ưu tiên đầu). Chọn emoji phù hợp với chủ đề NỘI DUNG (🚀, 💡, ⚡, 🎯, ✨, 📈...).
    3.  **Cấu trúc gợi ý (chọn 1 hoặc biến thể tương tự, Áp dụng cho NỘI DUNG và từ khóa):**
        *   "[Emoji] [Từ khóa chính, **ưu tiên từ danh sách**]: [Lợi ích bất ngờ/Con số ấn tượng/Câu hỏi gây tò mò RÚT RA TỪ NỘI DUNG]"
        *   "[Emoji] Bí Quyết [Từ khóa chính, **ưu tiên từ danh sách**]: Làm Chủ [Khía cạnh quan trọng RÚT RA TỪ NỘI DUNG] Năm ${new Date().getFullYear()}"
        *   "[Emoji] [Hành động mạnh]: [Từ khóa chính, **ưu tiên từ danh sách**] Với [Số lượng] Mẹo Từ Chuyên Gia (NẾU CÓ TRONG NỘI DỤNG)"
    4.  **Định dạng:** Viết hoa chữ cái đầu mỗi từ quan trọng (Title Case chuẩn tiếng Việt).
    5.  **Loại trừ Tuyệt đối:** Ngày tháng chi tiết (chỉ giữ năm ${new Date().getFullYear()} nếu cần VÀ PHÙ HỢP VỚI NỘI DUNG), tên tác giả, tên thương hiệu chung chung (trừ khi là chủ đề chính NỘI DUNG).
    6.  **Yếu tố thu hút:** Sử dụng câu hỏi, con số cụ thể (NẾU CÓ TRONG NỘI DUNG), hoặc góc nhìn độc đáo/gây tranh luận nhẹ nhàng để kích thích sự tò mò (DỰA TRÊN NỘI DUNG).

    **Đầu ra CHỈ và CHỈ gồm DUY NHẤT chuỗi tiêu đề Open Graph theo định dạng yêu cầu. KHÔNG BẤT KỲ THÔNG TIN NÀO KHÁC.**

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    🚀 Tối Ưu Performance React: 7 Bí Mật Giúp App Chạy Nhanh Hơn ${new Date().getFullYear()}
    ---END---
  `;
  return generateSEOContent(prompt);
}

export const aiGenerateOpenGraphDescription = async (content: string, generatedKeywords: string = ''): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT mô tả Open Graph (og:description) súc tích, cung cấp giá trị cốt lõi và khuyến khích người dùng khám phá thêm khi thấy trên mạng xã hội.

    **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
    "${content}"

    **Các từ khóa quan trọng đã được xác định (Ưu tiên sử dụng nếu phù hợp):**
    ${generatedKeywords ? generatedKeywords : "Không có từ khóa ưu tiên."}


    **Yêu cầu CỤ THỂ (NGHIÊM NGẶT tuân thủ):**
    1.  **Cấu trúc (Dựa trên NỘI DUNG và ưu tiên từ khóa):**
        *   **Dòng "Eyebrow" (Đầu tiên):** "[Danh mục tiếng Việt phù hợp (Suy luận từ NỘI DUNG)] | [Thời gian đọc ước tính (Suy luận từ NỘI DUNG)] phút | [Cấp độ (Suy luận từ NỘI DUNG): Cơ bản/Nâng cao/Chuyên gia]" (Ví dụ: Phát triển Web | 8 phút | Nâng cao)
        *   **Câu Hấp Dẫn (Tiếp theo):** Nêu bật một thống kê gây sốc (NẾU CÓ TRONG NỘI DUNG), một sự thật ít biết (NẾU CÓ), hoặc một lợi ích cốt lõi giải quyết vấn đề người đọc (RÚT RA TỪ NỘI DUNG). **Lồng ghép các từ khóa phụ/đuôi dài từ danh sách đã cho một cách tự nhiên.**
        *   **Nội dung chính:** Tóm tắt 2-3 lợi ích/điểm chính mà người đọc sẽ nhận được (RÚT RA TỪ NỘI DUNG). Có thể thêm 1 sự thật thú vị/đáng ngạc nhiên liên quan (NẾU CÓ). **Tiếp tục lồng ghép các từ khóa phụ/đuôi dài từ danh sách đã cho một cách tự nhiên.**
        *   **Emoji:** Thêm 1-2 emoji liên quan ĐẾN NỘI DUNG, đặt ở vị trí phù hợp để tăng sự chú ý (✨, ✅, 👉, 💡...).
        *   **CTA (Cuối cùng):** Sử dụng lời kêu gọi hành động rõ ràng, phù hợp với mạng xã hội (VD: Khám phá ngay, Đọc ngay!).
    2.  **Độ dài:** Giới hạn CHÍNH XÁC trong khoảng 185-195 ký tự. Đây là yêu cầu QUAN TRỌNG. Hãy đếm kỹ độ dài của đầu ra cuối cùng.
    3.  **Loại trừ Tuyệt đối:** Các cụm từ quá chung chung ("bài viết này nói về..."), thông tin tác giả, quảng cáo lộ liễu. Bất kỳ thông tin nào KHÔNG LIÊN QUAN ĐẾN NỘI DUNG.
    4.  **Ngôn ngữ:** Tự nhiên, dễ hiểu, tạo cảm giác đáng tin cậy và hữu ích (Văn phong tiếng Việt).
    5.  **Xác thực Cuối cùng:** **Đảm bảo đã ưu tiên sử dụng từ khóa từ danh sách được cung cấp nếu phù hợp và lồng ghép tự nhiên.**

    **Đầu ra CHỈ và CHỈ gồm DUY NHẤT chuỗi mô tả Open Graph theo định dạng yêu cầu. KHÔNG BẤT KỲ THÔNG TIN NÀO KHÁC.**

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    Lập Trình Frontend | 10 phút | Nâng cao ✨ Hơn 70% ứng dụng React gặp lỗi performance? Khám phá 7 kỹ thuật tối ưu độc quyền ${new Date().getFullYear()} giúp tăng tốc độ tải và trải nghiệm người dùng vượt trội. Đừng bỏ lỡ bí mật từ chuyên gia! 👉 Tìm hiểu ngay!
    ---END---
  `;
  return generateSEOContent(prompt);
}

export const aiGenerateTitleBlog = async (content: string, generatedKeywords: string = ''): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT tiêu đề bài blog (Title Tag) được tối ưu SEO HOÀN HẢO để vừa thu hút người đọc Việt Nam vừa đạt thứ hạng cao trên Google.

    **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
    "${content}"

    **Các từ khóa quan trọng đã được xác định (Ưu tiên sử dụng):**
    ${generatedKeywords ? generatedKeywords : "Không có từ khóa ưu tiên."}

    **Yêu cầu NGHIÊM NGẶT (TUYỆT ĐỐI tuân thủ):**
    1.  **Thành phần (Dựa trên NỘI DUNG và từ khóa ưu tiên):**
        *   Bắt buộc chứa Từ khóa chính ĐƯỢC RÚT RA TỪ NỘI DUNG, **ưu tiên chọn từ khóa phù hợp nhất từ danh sách đã cho.**
        *   Nên chứa Từ khóa phụ quan trọng hoặc yếu tố ngữ nghĩa liên quan ĐẾN NỘI DUNG, **ưu tiên từ danh sách đã cho nếu phù hợp.**
        *   Sử dụng từ ngữ mạnh mẽ, gợi lợi ích hoặc giải quyết vấn đề ĐỀ CẬP TRONG NỘI DUNG (vd: Bí quyết, Giải mã, Tăng tốc, Tránh sai lầm, Hiệu quả...).
    2.  **Định dạng:** Viết hoa chữ cái đầu mỗi từ quan trọng (Title Case chuẩn tiếng Việt).
    3.  **Yếu tố thời gian:** Thêm năm hiện tại (${new Date().getFullYear()}) trong dấu ngoặc đơn "( )" ở cuối hoặc gần cuối tiêu đề.
    4.  **Độ dài:** Tối ưu CHÍNH XÁC trong khoảng 65-75 ký tự. Đây là yêu cầu QUAN TRỌNG. Hãy đếm kỹ độ dài của đầu ra cuối cùng.
    5.  **Góc nhìn độc đáo/Giải quyết vấn đề (Dựa trên NỘI DUNG và từ khóa):** Tập trung vào góc nhìn gây tò mò hoặc giải quyết "nỗi đau" của người đọc Việt Nam như ĐỀ CẬP TRONG NỘI DUNG, **có lồng ghép từ khóa phù hợp từ danh sách.**
    6.  **Bổ nghĩa (Tùy chọn nhưng khuyến khích, NẾU PHÙ HỢP VỚI NỘI DUNG và từ khóa):** Nếu phù hợp, thêm yếu tố làm rõ loại nội dung: "[Hướng dẫn chi tiết]", "[Case study thực tế]", "[Checklist]", "[So sánh]". Đặt trong dấu ngoặc vuông [ ].
    7.  **Loại trừ Tuyệt đối:** Tính từ mơ hồ, các cụm từ câu view rẻ tiền, dấu chấm than quá nhiều. Bất kỳ thông tin nào KHÔNG LIÊN QUAN ĐẾN NỘI DUNG.

    **Đầu ra CHỈ và CHỈ gồm DUY NHẤT chuỗi tiêu đề bài blog theo định dạng yêu cầu. KHÔNG BẤT CỨ THÔNG TIN NÀO KHÁC.**

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    Tối Ưu Performance React: 7 Sai Lầm Phổ Biến Cần Tránh (${new Date().getFullYear()})
    ---END---
  `;
  return generateSEOContent(prompt);
}

export const aiGenerateSummaryContent = async (content: string, generatedKeywords: string = ''): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT bản tóm tắt NỔI BẬT, GIẬT TÍT để chia sẻ trên mạng xã hội (Facebook, Twitter, LinkedIn...), thu hút sự chú ý và tương tác của cộng đồng developer/người quan tâm tại Việt Nam.

    **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
    "${content}"

    **Các từ khóa quan trọng đã được xác định (Ưu tiên sử dụng nếu phù hợp):**
    ${generatedKeywords ? generatedKeywords : "Không có từ khóa ưu tiên."}

    **Yêu cầu CỤ THỂ (NGHIÊM NGẶT tuân thủ):**
    1.  **Mở đầu (Hook):** Bắt đầu bằng một cụm từ mạnh, gây chú ý tức thời (VD: TIN NÓNG:, CẢNH BÁO:, BẠN CÓ BIẾT?).
    2.  **Nội dung cốt lõi (Dựa trên NỘI DUNG và từ khóa):**
        *   Nêu bật 1-2 thống kê ấn tượng hoặc một tuyên bố gây ngạc nhiên/đi ngược số đông liên quan đến NỘI DUNG (NẾU CÓ TRONG NỘI DUNG). **Lồng ghép từ khóa phù hợp từ danh sách.**
        *   Liệt kê ngắn gọn 2-3 lợi ích/giải pháp chính mà bài viết mang lại (RÚT RA TỪ NỘI DUNG). **Lồng ghép từ khóa phù hợp từ danh sách.**
    3.  **Hashtag:**
        *   Sử dụng CHÍNH XÁC 2 hashtag (bắt đầu bằng #).
        *   1 hashtag rộng về ngành/chủ đề lớn (vd: #LapTrinhWeb).
        *   1 hashtag ngách, cụ thể hơn về NỘI DUNG (vd: #OptimizeReact). Chọn hashtag phổ biến tại Việt Nam và LIÊN QUAN ĐẾN NỘI DUNG. **Nên chọn các hashtag liên quan đến các từ khóa chính/phụ trong danh sách.**
    4.  **Emoji:** Thêm CHÍNH XÁC MỘT cặp emoji phù hợp với chủ đề NỘI DUNG và tone bài viết (🚀🔥, 💡👨‍💻...).
    5.  **Độ dài:** Giới hạn CHÍNH XÁC trong khoảng 240-250 ký tự. Đây là yêu cầu QUAN TRỌNG. Hãy đếm kỹ độ dài của đầu ra cuối cùng.
    6.  **CTA (Kêu gọi hành động):** Kết thúc bằng một lời kêu gọi tương tác tự nhiên (VD: Chia sẻ!, Tag ngay!, Lưu lại!).
    7.  **Loại trừ Tuyệt đối:** KHÔNG chèn link trực tiếp, không đề cập tên tác giả cụ thể (trừ khi là nhân vật chính của NỘI DUNG). Bất kỳ thông tin nào KHÔNG LIÊN QUAN ĐẾN NỘI DUNG.

    **Đầu ra CHỈ và CHỈ gồm DUY NHẤT bản tóm tắt theo định dạng yêu cầu. KHÔNG BẤT KỲ THÔNG TIN NÀO KHÁC.**

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    TIN NÓNG: Điểm chuẩn React ${new Date().getFullYear()} chỉ ra 7 kỹ thuật tối ưu giúp giảm tải trang tới 60%! 🚀🔥 Khám phá ngay bí quyết xử lý re-render và lazy loading hiệu quả mà ít ai chia sẻ. #FrontendDev #OptimizeReact Tag ngay một đồng nghiệp Reactjs!
    ---END---
  `;
  return generateSEOContent(prompt);
}

export const aiGenerateExcerpt = async (content: string, generatedKeywords: string = ''): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT đoạn trích blog (excerpt) NGẮN GỌN, HẤP DẪN, khơi gợi đủ sự tò mò để người đọc nhấp vào xem toàn bộ bài viết từ trang danh sách blog hoặc kết quả tìm kiếm.

    **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
    "${content}"

    **Các từ khóa quan trọng đã được xác định (Ưu tiên sử dụng nếu phù hợp):**
    ${generatedKeywords ? generatedKeywords : "Không có từ khóa ưu tiên."}

    **Yêu cầu CỤ THỂ (NGHIÊM NGẶT tuân thủ):**
    1.  **Mở đầu (5-7 từ đầu):** Tạo cảm giác cấp bách, liên quan trực tiếp đến vấn đề hoặc cập nhật mới nhất ĐỀ CẬP TRONG NỘI DUNG. Ví dụ: "Ứng dụng React của bạn chậm?", "Cập nhật ${new Date().getFullYear()}: Tối ưu...", "Đừng mắc phải lỗi này...". **Cố gắng lồng ghép từ khóa chính/phụ từ danh sách.**
    2.  **Nội dung chính (Dựa trên NỘI DUNG và từ khóa):**
        *   Nêu bật 1 thống kê đáng chú ý (NẾU CÓ TRONG NỘI DUNG) hoặc 1-2 "nỗi đau" mà người đọc Việt Nam thường gặp phải liên quan đến chủ đề (RÚT RA TỪ NỘI DUNG). **Lồng ghép các từ khóa phụ/đuôi dài từ danh sách một cách tự nhiên.**
        *   Gợi ý về 2-3 giải pháp/lợi ích chính sẽ được tìm thấy trong bài viết (RÚT RA TỪ NỘI DUNG). **Tiếp tục lồng ghép các từ khóa phụ/đuôi dài từ danh sách một cách tự nhiên.**
    3.  **Yếu tố bổ nghĩa (Nếu có, NẾU PHÙ HỢP VỚI NỘI DUNG):** Có thể thêm yếu tố làm rõ ngữ cảnh trong ngoặc vuông. Ví dụ: "[Cập nhật ${new Date().getFullYear()}]", "[Case Study]", "[Hướng dẫn cho người mới]".
    4.  **Độ dài:** Giới hạn CHÍNH XÁC trong khoảng 125-135 ký tự. Đây là yêu cầu QUAN TRỌNG NHẤT. Hãy đếm kỹ độ dài của đầu ra cuối cùng.
    5.  **Ngôn ngữ:** Sử dụng ngôn ngữ rõ ràng, súc tích, dễ hiểu (tương đương trình độ đọc lớp 9-10), TRÁNH thuật ngữ quá chuyên sâu hoặc văn phong bị động. Tập trung vào lợi ích và giải pháp ĐỀ CẬP TRONG NỘI DUNG, **có sử dụng từ khóa từ danh sách.**
    6.  **Định dạng:** CHỈ trả về DUY NHẤT một đoạn văn bản thuần túy. KHÔNG BẤT KỲ THÔNG TIN NÀO KHÁC.
    7.  **Xác thực Cuối cùng:** **Đảm bảo đã ưu tiên sử dụng từ khóa từ danh sách được cung cấp nếu phù hợp và lồng ghép tự nhiên.**

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    [Cập nhật ${new Date().getFullYear()}] Ứng dụng React ì ạch? Hơn 70% dev gặp khó khăn tối ưu. Khám phá 7 chiến lược performance đã được kiểm chứng giúp code sạch, tải trang nhanh hơn thấy rõ.
    ---END---
  `;
  return generateSEOContent(prompt);
}



export const aiEnhanceContentBlogForSEO = async (content: string): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tối ưu hóa TOÀN BỘ nội dung bài blog sau cho SEO, cải thiện khả năng xếp hạng trên Google và trải nghiệm đọc cho độc giả Việt Nam.

    **Nội dung cần tối ưu (Dựa TRỰC TIẾP vào đây, TUYỆT ĐỐI KHÔNG THAY ĐỔI Ý CHÍNH):**
    "${content}"

    **Yêu cầu NGHIÊM NGẶT (TUYỆT ĐỐI tuân thủ):**
    1.  **Đầu ra:** PHẢI là TOÀN BỘ nội dung bài viết đã được tối ưu, ở định dạng Markdown chuẩn. KHÔNG THÊM bất kỳ lời giải thích, lời mở đầu hay kết thúc nào về quá trình tối ưu. CHỈ TRẢ VỀ NỘI DUNG.
    2.  **Tối ưu hóa SEO trong nội dung:**
        *   Tích hợp MỘT CÁCH TỰ NHIÊN và KHÔNG GƯỢNG ÉP các từ khóa và cụm từ khóa liên quan được gợi ý bởi nội dung gốc vào các đoạn văn, tiêu đề phụ (heading). Từ khóa nên xuất hiện ở đầu bài viết và rải rác khắp nội dung một cách hợp lý.
        *   Cải thiện cấu trúc bài viết bằng cách sử dụng các heading (H1, H2, H3...) để chia nhỏ nội dung thành các phần dễ đọc, dễ quét (skim) và có cấu trúc logic. H1 nên được sử dụng cho tiêu đề chính (tức là dòng đầu tiên sau khi tối ưu), H2 cho các phần lớn, H3 cho các phần nhỏ hơn.
        *   Đảm bảo câu văn rõ ràng, súc tích, sử dụng ngôn ngữ tiếng Việt tự nhiên, văn phong phù hợp với chủ đề và đối tượng độc giả (developer, người dùng phổ thông, v.v. - suy luận từ nội dung gốc).
        *   Sử dụng danh sách (unordered lists bằng \`*\` hoặc \`-\`, ordered lists bằng \`1.\`, \`2.\`, v.v.) nếu các đoạn nội dung gốc trình bày các bước, liệt kê, hoặc các điểm chính cần nhấn mạnh.
        *   Thêm **in đậm** (\`**từ/cụm từ**\`) cho các thuật ngữ quan trọng hoặc từ khóa chính xuất hiện lần đầu trong mỗi phần/đoạn để nhấn mạnh.
    3.  **Định dạng Markdown chuẩn:**
        *   Sử dụng cú pháp Markdown cho headings (\`#\`, \`##\`, \`###\`), paragraphs (dòng trống), lists (\`*\`, \`-\`, \`1.\`), bold (\`**\`), italic (\`*\`), code blocks (\` \`\` \` cho inline, \` \`\`\` \` cho multi-line, kèm theo ngôn ngữ nếu có thể suy luận), quotes (\`>\`).
        *   **Xử lý hình ảnh (Quan trọng):** Nếu trong nội dung gốc có bất kỳ thông tin nào gợi ý về hình ảnh (ví dụ: mô tả hình ảnh, URL hình ảnh, hoặc cả hai), hãy định dạng nó thành \`![Mô tả alt text cho hình ảnh](URL_hình_ảnh)\`.
            *   Tạo alt text (Mô tả alt text cho hình ảnh) thật mô tả, súc tích và liên quan chặt chẽ đến nội dung hình ảnh và ngữ cảnh đoạn văn, như cách người dùng khiếm thị hoặc công cụ tìm kiếm hiểu về hình ảnh đó. Tuyệt đối không chỉ dùng từ khóa nhồi nhét.
            *   Sử dụng URL hình ảnh gốc nếu được cung cấp.
            *   Nếu nội dung gốc chỉ có mô tả, tạo alt text và sử dụng một placeholder URL nếu không có URL thật (ví dụ: \`https://placeholder.com/image.jpg\`). Tuy nhiên, ưu tiên sử dụng URL thật nếu có.
            *   Nếu nội dung gốc chỉ có URL trần, cố gắng tạo alt text hợp lý dựa trên ngữ cảnh đoạn văn chứa URL đó.
            *   Nếu nội dung gốc không đề cập hình ảnh nhưng đoạn văn có thể hữu ích nếu có hình ảnh minh họa, KHÔNG TỰ Ý TẠO HÌNH ẢNH hay URL. Chỉ xử lý hình ảnh đã được gợi ý trong nội dung gốc.
    4.  **Giữ nguyên ý chính và Dữ liệu:** Tuyệt đối KHÔNG thay đổi ý nghĩa cốt lõi, thông tin kỹ thuật, số liệu, ví dụ code, hoặc các lập luận chính của bài viết gốc. Chỉ tập trung vào việc *trình bày lại*, *tổ chức cấu trúc* và *bổ sung từ khóa* một cách tự nhiên để tối ưu SEO.
    5.  **Độ dài:** Độ dài nội dung sau tối ưu nên tương đương hoặc dài hơn một chút (khoảng 5-15%) so với nội dung gốc để thêm từ khóa và heading, nhưng tránh lặp từ, nhồi nhét từ khóa, hoặc kéo dài không cần thiết làm giảm chất lượng đọc.
    6.  **Ngôn ngữ:** Tiếng Việt chuẩn, tự nhiên, văn phong nhất quán với nội dung gốc, dễ hiểu cho độc giả mục tiêu.
    7.  **Định dạng đầu ra cuối cùng:** CHỈ và CHỈ gồm DUY NHẤT chuỗi Markdown của nội dung đã được tối ưu.

    ---END---
  `;
  return generateSEOContent(prompt);
}

export const aiGenerateFactAndknowledge = async (title: string): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT thông tin thú vị hoặc kiến thức chuyên sâu ngắn gọn, liên quan trực tiếp đến chủ đề AI của bài blog dựa trên tiêu đề đã cho. Mục đích là cung cấp một điểm nhấn đáng chú ý, có thể dùng làm "Did You Know?" hoặc một fact nhanh.

    **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
    Tiêu đề bài blog: "${title}"
    **Yêu cầu NGHIÊM NGẶT (TUYỆT ĐỐI tuân thủ):**
    1.  **Đầu ra:** CHỈ và CHỈ gồm MỘT chuỗi văn bản DUY NHẤT là thông tin/kiến thức đó. KHÔNG THÊM bất kỳ lời giải thích, lời mở đầu hay kết thúc nào về quá trình tạo. CHỈ TRẢ VỀ THÔNG TIN.
    2.  **Nội dung:**
        *   Phải liên quan MỘT CÁCH CHẶT CHẼ đến chủ đề AI được thể hiện trong tiêu đề.
        *   Có thể là một sự thật ít biết, một thống kê ấn tượng (nếu có thể suy luận hợp lý từ chủ đề), một khái niệm cốt lõi được giải thích cực kỳ ngắn gọn, hoặc một ứng dụng nổi bật của AI trong lĩnh vực đó.
        *   Sử dụng ngôn ngữ tiếng Việt tự nhiên, dễ hiểu, hấp dẫn.
        *   Nên cung cấp một giá trị nhỏ hoặc gây tò mò liên quan đến chủ đề chính.
    3.  **Độ dài:** Cực kỳ ngắn gọn, lý tưởng là 1-2 câu. KHÔNG VƯỢT QUÁ 150 ký tự. Hãy đếm ký tự của đầu ra cuối cùng để đảm bảo.
    4.  **Định dạng:** Văn bản thuần túy. KHÔNG Markdown (headings, bold, lists, code blocks), KHÔNG emoji, KHÔNG dấu ngoặc kép quanh câu trả lời.
    5.  **Đảm bảo:** Thông tin cung cấp phải có vẻ chính xác và đáng tin cậy dựa trên kiến thức chung về AI và chủ đề tiêu đề.
    6.  **Không bắt đầu bằng "Bạn có biết" Or "Did you know":** Trong Template đã có sẵn "Bạn có biết" Chỉ output ra nội dung. 
    **Đầu ra CHỈ và CHỈ gồm DUY NHẤT chuỗi thông tin/kiến thức theo định dạng yêu cầu. KHÔNG BẤT KỲ THÔNG TIN NÀO KHÁC.**

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    Một mô hình ngôn ngữ lớn như GPT-4 có thể có tới 1.7 nghìn tỷ tham số, cho phép nó hiểu và tạo ra văn bản phức tạp đáng kinh ngạc.
    **Ví dụ Định dạng Đầu ra Không Mong muốn (Không trả về phần này):**
    Bạn Có biết: Một mô hình ngôn ngữ lớn như GPT-4 có thể có tới 1.7 nghìn tỷ tham số, cho phép nó hiểu và tạo ra văn bản phức tạp đáng kinh ngạc.
    ---END---
  `;
  return generateSEOContent(prompt);
}