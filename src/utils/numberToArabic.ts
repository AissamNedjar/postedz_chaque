// تحويل الأرقام إلى كلمات باللغة العربية مع ترتيب صحيح
export const numberToArabicWords = (num: number): string => {
  if (num === 0) return 'صفر';

  const ones = [
    '', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة',
    'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر',
    'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'
  ];

  const tens = [
    '', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'
  ];

  const hundreds = [
    '', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'
  ];

  const convertThreeDigits = (n: number): string => {
    let result = '';
    
    // المئات
    const hundredsDigit = Math.floor(n / 100);
    if (hundredsDigit > 0) {
      result += hundreds[hundredsDigit];
    }
    
    // الباقي (العشرات والوحدات)
    const remainder = n % 100;
    
    if (remainder > 0) {
      if (result) result += ' و'; // إضافة حرف الواو
      
      if (remainder < 20) {
        result += ones[remainder];
      } else {
        const tensDigit = Math.floor(remainder / 10);
        const onesDigit = remainder % 10;
        
        // ترتيب صحيح: الوحدات أولاً ثم العشرات
        if (onesDigit > 0) {
          result += ones[onesDigit] + ' و' + tens[tensDigit];
        } else {
          result += tens[tensDigit];
        }
      }
    }
    
    return result;
  };

  if (num < 1000) {
    return convertThreeDigits(num);
  }

  let result = '';
  let parts = []; // لحفظ أجزاء الرقم
  
  // الملايين
  if (num >= 1000000) {
    const millions = Math.floor(num / 1000000);
    let millionsPart = '';
    
    if (millions === 1) {
      millionsPart = 'مليون';
    } else if (millions === 2) {
      millionsPart = 'مليونان';
    } else if (millions >= 3 && millions <= 10) {
      millionsPart = convertThreeDigits(millions) + ' ملايين';
    } else {
      millionsPart = convertThreeDigits(millions) + ' مليون';
    }
    
    parts.push(millionsPart);
    num %= 1000000;
  }

  // الآلاف
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    let thousandsPart = '';
    
    if (thousands === 1) {
      thousandsPart = 'ألف';
    } else if (thousands === 2) {
      thousandsPart = 'ألفان';
    } else if (thousands >= 3 && thousands <= 10) {
      thousandsPart = convertThreeDigits(thousands) + ' آلاف';
    } else {
      thousandsPart = convertThreeDigits(thousands) + ' ألف';
    }
    
    parts.push(thousandsPart);
    num %= 1000;
  }

  // المئات والعشرات والوحدات
  if (num > 0) {
    parts.push(convertThreeDigits(num));
  }

  // ربط الأجزاء بحرف الواو
  result = parts.join(' و');

  return result.trim();
};