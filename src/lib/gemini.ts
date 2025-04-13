import { env } from '@/env'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(env.GOOGLE_GEMINI_API)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

const generateSEOContent = async (prompt: string): Promise<string | null> => {
  try {
    console.log('--- Sending Prompt to AI ---');
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log('--- Received AI Response ---'); 
    return text.replace(/[*#"`-]/g, '').trim();
  } catch (error: any) {
    console.error('AI Generation Error:', error?.message || error);
    if (error.response) {
      console.error('AI Response Error Details:', error.response.promptFeedback);
    }
    return null;
  }
}


export const aiGenerateSEOTags = async (content: string): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo bộ thẻ meta keywords TỐI ƯU NHẤT để bài viết này có khả năng ĐỨNG TOP 1 Google tại Việt Nam.
    **Nội dung cần phân tích:**
    "${content}"

    **Yêu cầu NGHIÊM NGẶT:**
    1.  **Số lượng:** CHÍNH XÁC 7 thẻ.
    2.  **Định dạng:** Chỉ gồm các từ khóa viết thường, phân tách bằng dấu phẩy (KHÔNG giải thích, KHÔNG markdown, KHÔNG số thứ tự).
    3.  **Cấu trúc:**
        *   2 từ khóa chính (1-2 từ, cốt lõi nhất).
        *   3 từ khóa phụ (2-3 từ, mở rộng chủ đề).
        *   2 cụm từ khóa đuôi dài (4-5 từ, giải quyết ý định cụ thể).
    4.  **Tối ưu hóa:**
        *   Dựa trên phân tích TF-IDF của nội dung đã cho.
        *   Kết hợp các biến thể từ khóa ngữ nghĩa (từ đồng nghĩa, khái niệm liên quan trong tiếng Việt).
        *   Phân tích khoảng trống từ khóa (dự đoán các từ đối thủ có thể bỏ lỡ nhưng người dùng Việt Nam tìm kiếm).
    5.  **Giới hạn:** Tổng độ dài tất cả các thẻ KHÔNG QUÁ 160 ký tự.
    6.  **Loại trừ:** Các cụm từ bị cấm: "tốt nhất", "hàng đầu", "hướng dẫn". Tuyệt đối không thêm bất kỳ giải thích nào.
    7.  **Ngôn ngữ:** Sử dụng từ ngữ người Việt Nam thường tìm kiếm.

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    react development, component architecture, state management, performance optimization, react hooks best practices, redux toolkit configuration, tối ưu react app
  `;
  return generateSEOContent(prompt);
}


export const aiGenerateMetaDescription = async (content: string): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT mô tả meta DUY NHẤT, cực kỳ hấp dẫn, tối ưu SEO, và thôi thúc người dùng nhấp vào KHI XUẤT HIỆN TRÊN GOOGLE.
    **Nội dung cần phân tích:**
    "${content}"

    **Yêu cầu TUYỆT ĐỐI:**
    1.  **Độ dài:** Chính xác trong khoảng 157-160 ký tự. Dùng CÔNG CỤ ĐẾM KÝ TỰ để đảm bảo. Mọi kết quả ngoài khoảng này sẽ bị TỪ CHỐI.
    2.  **Cấu trúc 3 phần RÕ RỆT:**
        *   Phần 1 (60-70 ký tự): [Động từ mạnh mẽ, cuốn hút tiếng Việt] + [Từ khóa chính cốt lõi] + [Số liệu/Giá trị cụ thể] + [Lợi ích trực tiếp]. Đặt từ khóa chính trong 10 từ đầu.
        *   Phần 2 (70-80 ký tự): [Từ khóa phụ liên quan] + [Giải pháp/Cách thức] + [Yếu tố thời gian/Cập nhật (vd: năm ${new Date().getFullYear()})]. Có thể bao gồm tỷ lệ %.
        *   Phần 3 (20-25 ký tự): [CTA thôi thúc hành động bằng tiếng Việt tự nhiên, rõ ràng].
    3.  **Từ ngữ:**
        *   Động từ mạnh gợi ý: Làm chủ | Khám phá | Nâng tầm | Bí quyết | Tối ưu | Giải mã... (chọn từ phù hợp nhất).
        *   Loại bỏ hoàn toàn các từ đệm không cần thiết (rất, thực sự, về cơ bản, khá là...).
        *   Sử dụng ngôn ngữ tự nhiên, lôi cuốn người đọc Việt.
    4.  **Xác thực:**
        *   Kiểm tra lại số ký tự lần cuối.
        *   Đảm bảo có CTA rõ ràng.
        *   Từ khóa chính xuất hiện sớm.
        *   Có năm hiện tại (${new Date().getFullYear()}).
    5.  **Định dạng:** Chỉ trả về DUY NHẤT một chuỗi mô tả meta, không giải thích, không markdown.

    **Ví dụ THÀNH CÔNG (Mô phỏng cấu trúc và độ dài):**
    Làm chủ 7 kỹ thuật tối ưu React ${new Date().getFullYear()} giúp giảm tải trang 50%. Khám phá bí quyết cho component và quản lý state hiệu quả, tăng tốc ứng dụng ngay hôm nay. Click xem! (159 ký tự)

    **Ví dụ BỊ TỪ CHỐI (Vượt quá ký tự hoặc sai cấu trúc):**
    Bài viết này sẽ hướng dẫn bạn cách cải thiện hiệu suất ứng dụng React của mình thông qua nhiều phương pháp tối ưu hóa khác nhau được các chuyên gia khuyên dùng... (175 ký tự)
  `;
  return generateSEOContent(prompt);
}


export const aiGenerateSEOKeywords = async (content: string): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo danh sách từ khóa SEO chiến lược giúp nội dung bao phủ tối đa các truy vấn tìm kiếm liên quan của người dùng Việt Nam.
    **Nội dung cần phân tích:**
    "${content}"

    **Yêu cầu CHÍNH XÁC:**
    1.  **Số lượng:** Đúng 15 từ khóa.
    2.  **Định dạng:** Viết thường, phân tách bằng dấu phẩy (KHÔNG giải thích, KHÔNG markdown).
    3.  **Phân bổ tỷ lệ (Ước tính):**
        *   ~40% đuôi ngắn (1-2 từ): Từ khóa cốt lõi, volume cao.
        *   ~40% đuôi vừa (3-4 từ): Từ khóa cụ thể hơn, thể hiện ý định rõ hơn.
        *   ~20% đuôi dài (5+ từ): Từ khóa rất cụ thể, giải quyết nhu cầu chi tiết, thường là câu hỏi.
    4.  **Chất lượng & Đa dạng:**
        *   Bao gồm từ khóa LSI ngữ nghĩa tiếng Việt (liên quan về mặt ý nghĩa).
        *   Kết hợp các từ/cụm từ thể hiện ý định người dùng Việt Nam ('cách', 'hướng dẫn', 'là gì', 'so sánh', 'đánh giá', 'mẹo', 'bí quyết', 'cho người mới bắt đầu', 'nâng cao'...).
        *   Thêm yếu tố mới mẻ nếu phù hợp ('${new Date().getFullYear()}', 'mới nhất', 'cập nhật').
        *   Ưu tiên các từ khóa có lượng tìm kiếm ước tính tốt tại thị trường Việt Nam (nếu có thể dự đoán, không cần dữ liệu chính xác).
    5.  **Loại trừ:**
        *   Từ khóa gốc bị lặp lại (vd: "react" và "react js" có thể giữ, nhưng không nên có quá nhiều biến thể rất nhỏ).
        *   Thuật ngữ thương hiệu của đối thủ cạnh tranh (trừ khi nội dung so sánh trực tiếp).
    6.  **Nhóm:** Cố gắng nhóm các từ khóa liên quan gần nhau một cách tự nhiên trong danh sách.

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    tối ưu react, cách tối ưu performance react, react performance ${new Date().getFullYear()}, giảm re-render react, lazy loading component react, react concurrent mode là gì, mẹo tối ưu react app, webpack config react, code splitting react, react hooks performance, state management react hiệu quả, cải thiện tốc độ react, kỹ thuật tối ưu react, ứng dụng react nhanh hơn, react profiling tools
  `;
  return generateSEOContent(prompt);
}


export const aiGenerateOpenGraphTitle = async (content: string): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT tiêu đề Open Graph (og:title) CỰC KỲ THU HÚT, khiến người dùng muốn nhấp vào khi thấy bài viết được chia sẻ trên Facebook, Zalo, Twitter...
    **Nội dung cần phân tích:**
    "${content}"

    **Yêu cầu TUYỆT ĐỐI:**
    1.  **Độ dài:** Chính xác trong khoảng 68-72 ký tự. Kiểm tra kỹ!
    2.  **Nội dung:**
        *   Phải chứa Từ khóa chính VÀ Từ khóa phụ quan trọng.
        *   Bao gồm 1 emoji LIÊN QUAN và TINH TẾ ở đầu hoặc cuối (ưu tiên đầu). Chọn emoji phù hợp với chủ đề công nghệ/nội dung bài viết (🚀, 💡, ⚡, 🎯, ✨, 📈...).
    3.  **Cấu trúc gợi ý (chọn 1 hoặc biến thể tương tự):**
        *   "[Emoji] [Từ khóa chính]: [Lợi ích bất ngờ/Con số ấn tượng/Câu hỏi gây tò mò]"
        *   "[Emoji] Bí Quyết [Từ khóa chính]: Làm Chủ [Khía cạnh quan trọng] Năm ${new Date().getFullYear()}"
        *   "[Emoji] [Hành động mạnh]: [Từ khóa chính] Với [Số lượng] Mẹo Từ Chuyên Gia"
    4.  **Định dạng:** Viết hoa chữ cái đầu mỗi từ quan trọng (Title Case chuẩn tiếng Việt).
    5.  **Loại trừ:** Ngày tháng chi tiết (chỉ giữ năm ${new Date().getFullYear()} nếu cần), tên tác giả, tên thương hiệu chung chung (trừ khi là chủ đề chính).
    6.  **Yếu tố thu hút:** Sử dụng câu hỏi, con số cụ thể, hoặc góc nhìn độc đáo/gây tranh luận nhẹ nhàng để kích thích sự tò mò.

    **Ví dụ Đầu Ra Mong Muốn:**
    🚀 Tối Ưu Performance React: 7 Bí Mật Giúp App Chạy Nhanh Hơn ${new Date().getFullYear()}
    💡 Làm Chủ State Management React: Từ Cơ Bản Đến Nâng Cao Cho Developer
  `;
  return generateSEOContent(prompt);
}


export const aiGenerateOpenGraphDescription = async (content: string): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT mô tả Open Graph (og:description) súc tích, cung cấp giá trị cốt lõi và khuyến khích người dùng khám phá thêm khi thấy trên mạng xã hội.
    **Nội dung cần phân tích:**
    "${content}"

    **Yêu cầu CỤ THỂ:**
    1.  **Cấu trúc:**
        *   **Dòng "Eyebrow" (Đầu tiên):** "[Danh mục tiếng Việt phù hợp] | [Thời gian đọc ước tính] phút | [Cấp độ: Cơ bản/Nâng cao/Chuyên gia]" (Ví dụ: Phát triển Web | 8 phút | Nâng cao)
        *   **Câu Hấp Dẫn (Tiếp theo):** Nêu bật một thống kê gây sốc, một sự thật ít biết, hoặc một lợi ích cốt lõi giải quyết vấn đề người đọc.
        *   **Nội dung chính:** Tóm tắt 2-3 lợi ích/điểm chính mà người đọc sẽ nhận được. Có thể thêm 1 sự thật thú vị/đáng ngạc nhiên liên quan.
        *   **Emoji:** Thêm 1-2 emoji liên quan, đặt ở vị trí phù hợp để tăng sự chú ý (✨, ✅, 👉, 💡...).
    2.  **Độ dài:** Giới hạn trong khoảng 185-195 ký tự. Kiểm tra kỹ!
    3.  **CTA (Cuối cùng):** Sử dụng lời kêu gọi hành động rõ ràng, phù hợp với mạng xã hội. Ví dụ: "Khám phá ngay bí quyết..." | "Tìm hiểu sâu hơn tại đây!" | "Đọc ngay để không bỏ lỡ!"
    4.  **Loại trừ:** Các cụm từ quá chung chung ("bài viết này nói về..."), thông tin tác giả, quảng cáo lộ liễu.
    5.  **Ngôn ngữ:** Tự nhiên, dễ hiểu, tạo cảm giác đáng tin cậy và hữu ích.

    **Ví dụ Đầu Ra Mong Muốn:**
    Lập Trình Frontend | 10 phút | Nâng cao ✨ Hơn 70% ứng dụng React gặp lỗi performance? Khám phá 7 kỹ thuật tối ưu độc quyền ${new Date().getFullYear()} giúp tăng tốc độ tải và trải nghiệm người dùng vượt trội. Đừng bỏ lỡ bí mật từ chuyên gia! 👉 Tìm hiểu ngay!
  `;
  return generateSEOContent(prompt);
}

export const aiGenerateTitleBlog = async (content: string): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT tiêu đề bài blog (Title Tag) được tối ưu SEO HOÀN HẢO để vừa thu hút người đọc Việt Nam vừa đạt thứ hạng cao trên Google.
    **Nội dung cần phân tích:**
    "${content}"

    **Yêu cầu NGHIÊM NGẶT:**
    1.  **Thành phần:**
        *   Bắt buộc chứa Từ khóa chính.
        *   Nên chứa Từ khóa phụ quan trọng hoặc yếu tố ngữ nghĩa liên quan.
        *   Sử dụng từ ngữ mạnh mẽ, gợi lợi ích hoặc giải quyết vấn đề (vd: Bí quyết, Giải mã, Tăng tốc, Tránh sai lầm, Hiệu quả...).
    2.  **Định dạng:** Viết hoa chữ cái đầu mỗi từ quan trọng (Title Case chuẩn tiếng Việt).
    3.  **Yếu tố thời gian:** Thêm năm hiện tại (${new Date().getFullYear()}) trong dấu ngoặc đơn "( )" ở cuối hoặc gần cuối tiêu đề.
    4.  **Độ dài:** Tối ưu trong khoảng 65-75 ký tự.
    5.  **Góc nhìn độc đáo/Giải quyết vấn đề:** Thay vì chỉ mô tả, hãy tập trung vào góc nhìn gây tò mò hoặc giải quyết "nỗi đau" của người đọc. Ví dụ: "Bí mật ít ai biết...", "Lỗi sai thường gặp...", "Giải mã...", "Chiến lược hiệu quả...".
    6.  **Bổ nghĩa (Tùy chọn nhưng khuyến khích):** Nếu phù hợp, thêm yếu tố làm rõ loại nội dung: "[Hướng dẫn chi tiết]", "[Case study thực tế]", "[Checklist]", "[So sánh]". Đặt trong dấu ngoặc vuông [ ].
    7.  **Loại trừ:** Tính từ mơ hồ (tuyệt vời, đáng kinh ngạc - trừ khi có số liệu chứng minh), các cụm từ câu view rẻ tiền, dấu chấm than quá nhiều.

    **Ví dụ Đầu Ra Mong Muốn:**
    Tối Ưu Performance React: 7 Sai Lầm Phổ Biến Cần Tránh (${new Date().getFullYear()})
    Bí Quyết Tăng Tốc React App: Hướng Dẫn Chi Tiết Cho Developer (${new Date().getFullYear()})
    Giải Mã Lazy Loading Trong React: Tối Ưu Tải Trang Hiệu Quả (${new Date().getFullYear()}) [Kèm Ví Dụ]
  `;
  return generateSEOContent(prompt);
}

export const aiGenerateSummaryContent = async (content: string): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT bản tóm tắt NỔI BẬT, GIẬT TÍT để chia sẻ trên mạng xã hội (Facebook, Twitter, LinkedIn...), thu hút sự chú ý và tương tác của cộng đồng developer/người quan tâm tại Việt Nam.
    **Nội dung cần phân tích:**
    "${content}"

    **Yêu cầu CỤ THỂ:**
    1.  **Mở đầu (Hook):** Bắt đầu bằng một cụm từ mạnh, gây chú ý tức thì. Ví dụ: "TIN NÓNG:", "CẢNH BÁO QUAN TRỌNG:", "MỚI RA MẮT:", "BẠN CÓ BIẾT?", "ĐỪNG BỎ LỠ:".
    2.  **Nội dung cốt lõi:**
        *   Nêu bật 1-2 thống kê ấn tượng hoặc một tuyên bố gây ngạc nhiên/đi ngược số đông liên quan đến nội dung.
        *   Liệt kê ngắn gọn 2-3 lợi ích/giải pháp chính mà bài viết mang lại.
    3.  **Hashtag:**
        *   Sử dụng CHÍNH XÁC 2 hashtag:
            *   1 hashtag rộng về ngành/chủ đề lớn (vd: #LapTrinhWeb, #FrontendDev, #JavaScript).
            *   1 hashtag ngách, cụ thể hơn về nội dung (vd: #ReactJS, #OptimizeReact, #WebPerformance, #StateManagement). Chọn hashtag phổ biến tại Việt Nam.
    4.  **Emoji:** Thêm MỘT cặp emoji phù hợp với chủ đề và tone bài viết để tăng tính biểu cảm (🚀🔥, 💡👨‍💻, ⚡🤯, ✅📈...).
    5.  **Độ dài:** Giới hạn trong khoảng 240-250 ký tự.
    6.  **CTA (Kêu gọi hành động):** Kết thúc bằng một lời kêu gọi tương tác tự nhiên. Ví dụ: "Chia sẻ nếu bạn thấy hữu ích!", "Tag ngay một developer bạn biết!", "Anh em Reactjs vào xác nhận!", "Lưu lại để dùng khi cần!".
    7.  **Loại trừ:** KHÔNG chèn link trực tiếp vào đây, không đề cập tên tác giả cụ thể (trừ khi là nhân vật chính của nội dung).

    **Ví dụ Đầu Ra Mong Muốn:**
    TIN NÓNG: Điểm chuẩn React ${new Date().getFullYear()} chỉ ra 7 kỹ thuật tối ưu giúp giảm tải trang tới 60%! 🚀🔥 Khám phá ngay bí quyết xử lý re-render và lazy loading hiệu quả mà ít ai chia sẻ. #FrontendDev #OptimizeReact Tag ngay một đồng nghiệp Reactjs!
    BẠN CÓ BIẾT? Hơn 75% lỗi performance React đến từ việc quản lý state sai cách? 💡👨‍💻 Nắm vững 3 chiến lược state management hiệu quả ${new Date().getFullYear()} giúp code sạch, app mượt. #JavaScript #StateManagement Lưu lại để áp dụng ngay!
  `;
  return generateSEOContent(prompt);
}

export const aiGenerateExcerpt = async (content: string): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT đoạn trích blog (excerpt) NGẮN GỌN, HẤP DẪN, khơi gợi đủ sự tò mò để người đọc nhấp vào xem toàn bộ bài viết từ trang danh sách blog hoặc kết quả tìm kiếm.
    **Nội dung cần phân tích:**
    "${content}"

    **Yêu cầu CỤ THỂ:**
    1.  **Mở đầu (5-7 từ đầu):** Tạo cảm giác cấp bách, liên quan trực tiếp đến vấn đề hoặc cập nhật mới nhất. Ví dụ: "Ứng dụng React của bạn chậm?", "Cập nhật ${new Date().getFullYear()}: Tối ưu...", "Đừng mắc phải lỗi này...", "Giải pháp cho [vấn đề]...".
    2.  **Nội dung chính:**
        *   Nêu bật 1 thống kê đáng chú ý hoặc 1-2 "nỗi đau" mà người đọc (đặc biệt là developer Việt Nam) thường gặp phải liên quan đến chủ đề.
        *   Gợi ý về 2-3 giải pháp/lợi ích chính sẽ được tìm thấy trong bài viết.
    3.  **Yếu tố bổ nghĩa (Nếu có):** Có thể thêm yếu tố làm rõ ngữ cảnh trong ngoặc vuông. Ví dụ: "[Cập nhật ${new Date().getFullYear()}]", "[Case Study]", "[Hướng dẫn cho người mới]".
    4.  **Độ dài:** Giới hạn trong khoảng 125-135 ký tự.
    5.  **Ngôn ngữ:** Sử dụng ngôn ngữ rõ ràng, súc tích, dễ hiểu (tương đương trình độ đọc lớp 9-10), TRÁNH thuật ngữ quá chuyên sâu hoặc văn phong bị động. Tập trung vào lợi ích và giải pháp.
    6.  **Định dạng:** Chỉ trả về một đoạn văn bản thuần túy.

    **Ví dụ Đầu Ra Mong Muốn:**
    [Cập nhật ${new Date().getFullYear()}] Ứng dụng React ì ạch? Hơn 70% dev gặp khó khăn tối ưu. Khám phá 7 chiến lược performance đã được kiểm chứng giúp code sạch, tải trang nhanh hơn thấy rõ.
    React app của bạn re-render liên tục? Đừng lo! Bài viết này chỉ ra 5 bí quyết quản lý state và tối ưu component hiệu quả, dễ áp dụng ngay. [Cho người mới]
  `;
  return generateSEOContent(prompt);
}