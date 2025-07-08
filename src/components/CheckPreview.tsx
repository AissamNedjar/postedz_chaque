import React, { useState, useRef, useCallback } from 'react';
import { Printer, Eye, Sparkles, Move, Lock, Unlock } from 'lucide-react';
import { numberToArabicWords } from '../utils/numberToArabic';

interface CheckData {
  date: string;
  place: string;
  beneficiary: string;
  amount: string;
}

interface Position {
  x: number;
  y: number;
}

interface CheckPreviewProps {
  checkData: CheckData;
  positions: Record<string, Position>;
  setPositions: (positions: Record<string, Position>) => void;
}

const CheckPreview: React.FC<CheckPreviewProps> = ({ checkData, positions, setPositions }) => {
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [isLocked, setIsLocked] = useState(false);
  const checkRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // تنسيق التاريخ الجزائري DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getAmountInWords = () => {
    if (!checkData.amount || isNaN(Number(checkData.amount))) return '';
    return numberToArabicWords(Number(checkData.amount));
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, elementType: string) => {
    if (isLocked) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const checkRect = checkRef.current?.getBoundingClientRect();
    if (!checkRect) return;

    setDraggedElement(elementType);
    setIsDragging(true);
    
    // حفظ نقطة البداية
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
    
    // حفظ الموضع الأولي
    const currentPos = positions[elementType] || { x: 0, y: 0 };
    setInitialPosition(currentPos);
    
    // منع تحديد النص
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  }, [isLocked, positions]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !draggedElement || !checkRef.current) return;
    
    e.preventDefault();
    
    const checkRect = checkRef.current.getBoundingClientRect();
    
    // حساب المسافة المقطوعة
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // تحويل إلى نسبة مئوية
    let deltaXPercent = (deltaX / checkRect.width) * 100;
    let deltaYPercent = (deltaY / checkRect.height) * 100;
    
    // إصلاح اتجاه السحب للعناصر التي تستخدم right positioning
    if (draggedElement === 'beneficiary' || draggedElement === 'amountWords') {
      deltaXPercent = -deltaXPercent; // عكس الاتجاه للعناصر المحاذية لليمين
    }
    
    // الموضع الجديد
    const newX = Math.max(-100, Math.min(200, initialPosition.x + deltaXPercent));
    const newY = Math.max(-100, Math.min(200, initialPosition.y + deltaYPercent));
    
    setPositions({
      ...positions,
      [draggedElement]: { x: Math.round(newX), y: Math.round(newY) }
    });
  }, [isDragging, draggedElement, dragStart, initialPosition, positions, setPositions]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDraggedElement(null);
      
      // استعادة المؤشر والتحديد
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
  }, [isDragging]);

  // إضافة مستمعي الأحداث للنافذة
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handlePrint = () => {
    // إضافة تأخير قصير للتأكد من تحميل الصورة
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const resetPositions = () => {
    setPositions({
      date: { x: 2, y: 26 },
      place: { x: 62, y: 26 },
      beneficiary: { x: -2, y: 0 },
      amount: { x: 69, y: -47 },
      amountWords: { x: 30, y: -34 }
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20 hover-lift mobile-card">
      <div className="bg-blue-600 px-4 md:px-6 py-3 md:py-4 no-print">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1 md:p-1.5 rounded-lg">
              <Eye className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h2 className="text-base md:text-lg font-bold text-white">معاينة الشيك</h2>
          </div>
          <div className="flex gap-1 md:gap-2">
            <button
              onClick={() => setIsLocked(!isLocked)}
              className={`flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 md:py-2 rounded-xl transition-all duration-300 font-medium text-xs md:text-sm backdrop-blur-sm border border-white/20 hover:scale-105 mobile-button ${
                isLocked 
                  ? 'bg-red-500/80 text-white hover:bg-red-600/80' 
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
              }`}
            >
              {isLocked ? <Lock className="w-3 h-3 md:w-4 md:h-4" /> : <Unlock className="w-3 h-3 md:w-4 md:h-4" />}
              <span className="hidden sm:inline">{isLocked ? 'مقفل' : 'مفتوح'}</span>
              <span className="sm:hidden">{isLocked ? '🔒' : '🔓'}</span>
            </button>
            <button
              onClick={resetPositions}
              className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 md:py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 font-medium text-xs md:text-sm backdrop-blur-sm border border-white/20 hover:scale-105 mobile-button"
            >
              <Move className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">إعادة تعيين</span>
              <span className="sm:hidden">↩️</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 md:gap-1.5 px-3 md:px-4 py-1.5 md:py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all duration-300 font-medium text-xs md:text-sm backdrop-blur-sm border border-white/20 hover:scale-105 mobile-button"
            >
              <Printer className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">طباعة</span>
              <span className="sm:hidden">🖨️</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 md:p-6 print-container">
        {/* منطقة المعاينة العادية - تظهر في الشاشة فقط */}
        <div
          ref={checkRef}
          id="check-preview"
          className="relative w-full max-w-4xl mx-auto bg-center bg-no-repeat bg-contain rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 screen-only mobile-check-preview"
          style={{
            backgroundImage: `url('https://print-cheques.com/backend/public/img/16966844638648.jpg')`,
            paddingBottom: '45%', 
            minHeight: '300px',
            cursor: isDragging ? 'grabbing' : 'default'
          }}
        >
          {/* التاريخ */}
          {checkData.date && (
            <div
              className={`absolute text-xs md:text-sm font-bold text-black select-none drop-shadow-sm transition-all duration-200 px-2 md:px-3 py-1 md:py-1.5 rounded-lg min-w-max whitespace-nowrap print-text ${
                !isLocked ? 'cursor-grab hover:bg-blue-100/70 hover:border-2 hover:border-blue-500' : 'cursor-default'
              } ${
                draggedElement === 'date' ? 'bg-blue-200/80 border-2 border-blue-600 shadow-lg scale-105 z-50' : ''
              }`}
              style={{
                left: `${65 + (positions.date?.x || 0)}%`,
                top: `${25 + (positions.date?.y || 0)}%`,
                transform: 'translate(-50%, -50%)',
                fontFamily: 'Cairo, sans-serif'
              }}
              onMouseDown={(e) => handleMouseDown(e, 'date')}
              title={isLocked ? 'مقفل - اضغط على زر الفتح للتحرير' : 'اسحب لتغيير الموضع'}
            >
              {!isLocked && (
                <Move className="w-2 h-2 md:w-3 md:h-3 text-blue-600 absolute -top-1 -right-1 opacity-60 hover:opacity-100 transition-opacity no-print" />
              )}
              {formatDate(checkData.date)}
            </div>
          )}

          {/* المكان */}
          {checkData.place && (
            <div
              className={`absolute text-xs md:text-sm font-bold text-black select-none drop-shadow-sm transition-all duration-200 px-2 md:px-3 py-1 md:py-1.5 rounded-lg min-w-max whitespace-nowrap print-text ${
                !isLocked ? 'cursor-grab hover:bg-green-100/70 hover:border-2 hover:border-green-500' : 'cursor-default'
              } ${
                draggedElement === 'place' ? 'bg-green-200/80 border-2 border-green-600 shadow-lg scale-105 z-50' : ''
              }`}
              style={{
                left: `${25 + (positions.place?.x || 0)}%`,
                top: `${25 + (positions.place?.y || 0)}%`,
                transform: 'translate(-50%, -50%)',
                fontFamily: 'Cairo, sans-serif'
              }}
              onMouseDown={(e) => handleMouseDown(e, 'place')}
              title={isLocked ? 'مقفل - اضغط على زر الفتح للتحرير' : 'اسحب لتغيير الموضع'}
            >
              {!isLocked && (
                <Move className="w-2 h-2 md:w-3 md:h-3 text-green-600 absolute -top-1 -right-1 opacity-60 hover:opacity-100 transition-opacity no-print" />
              )}
              {checkData.place}
            </div>
          )}

          {/* المستفيد */}
          {checkData.beneficiary && (
            <div
              className={`absolute text-xs md:text-sm font-bold text-black select-none drop-shadow-sm transition-all duration-200 px-2 md:px-3 py-1 md:py-1.5 rounded-lg min-w-max whitespace-nowrap print-text ${
                !isLocked ? 'cursor-grab hover:bg-purple-100/70 hover:border-2 hover:border-purple-500' : 'cursor-default'
              } ${
                draggedElement === 'beneficiary' ? 'bg-purple-200/80 border-2 border-purple-600 shadow-lg scale-105 z-50' : ''
              }`}
              style={{
                right: `${15 + (positions.beneficiary?.x || 0)}%`,
                top: `${45 + (positions.beneficiary?.y || 0)}%`,
                transform: 'translate(50%, -50%)',
                fontFamily: 'Cairo, sans-serif'
              }}
              onMouseDown={(e) => handleMouseDown(e, 'beneficiary')}
              title={isLocked ? 'مقفل - اضغط على زر الفتح للتحرير' : 'اسحب لتغيير الموضع'}
            >
              {!isLocked && (
                <Move className="w-2 h-2 md:w-3 md:h-3 text-purple-600 absolute -top-1 -right-1 opacity-60 hover:opacity-100 transition-opacity no-print" />
              )}
              {checkData.beneficiary}
            </div>
          )}

          {/* المبلغ بالأرقام */}
          {checkData.amount && (
            <div
              className={`absolute text-xs md:text-sm font-bold text-black select-none drop-shadow-sm transition-all duration-200 px-2 md:px-3 py-1 md:py-1.5 rounded-lg min-w-max whitespace-nowrap print-text ${
                !isLocked ? 'cursor-grab hover:bg-yellow-100/70 hover:border-2 hover:border-yellow-500' : 'cursor-default'
              } ${
                draggedElement === 'amount' ? 'bg-yellow-200/80 border-2 border-yellow-600 shadow-lg scale-105 z-50' : ''
              }`}
              style={{
                left: `${15 + (positions.amount?.x || 0)}%`,
                top: `${65 + (positions.amount?.y || 0)}%`,
                transform: 'translate(-50%, -50%)',
                fontFamily: 'Cairo, sans-serif'
              }}
              onMouseDown={(e) => handleMouseDown(e, 'amount')}
              title={isLocked ? 'مقفل - اضغط على زر الفتح للتحرير' : 'اسحب لتغيير الموضع'}
            >
              {!isLocked && (
                <Move className="w-2 h-2 md:w-3 md:h-3 text-yellow-600 absolute -top-1 -right-1 opacity-60 hover:opacity-100 transition-opacity no-print" />
              )}
              {checkData.amount} دج
            </div>
          )}

          {/* المبلغ بالحروف */}
          {checkData.amount && (
            <div
              className={`absolute text-xs md:text-sm font-medium text-black select-none drop-shadow-sm transition-all duration-200 px-2 md:px-3 py-1 md:py-1.5 rounded-lg min-w-max whitespace-nowrap max-w-xs md:max-w-md print-text ${
                !isLocked ? 'cursor-grab hover:bg-orange-100/70 hover:border-2 hover:border-orange-500' : 'cursor-default'
              } ${
                draggedElement === 'amountWords' ? 'bg-orange-200/80 border-2 border-orange-600 shadow-lg scale-105 z-50' : ''
              }`}
              style={{
                right: `${15 + (positions.amountWords?.x || 0)}%`,
                top: `${65 + (positions.amountWords?.y || 0)}%`,
                transform: 'translate(50%, -50%)',
                fontFamily: 'Cairo, sans-serif'
              }}
              onMouseDown={(e) => handleMouseDown(e, 'amountWords')}
              title={isLocked ? 'مقفل - اضغط على زر الفتح للتحرير' : 'اسحب لتغيير الموضع'}
            >
              {!isLocked && (
                <Move className="w-2 h-2 md:w-3 md:h-3 text-orange-600 absolute -top-1 -right-1 opacity-60 hover:opacity-100 transition-opacity no-print" />
              )}
              {getAmountInWords()} دينار جزائري
            </div>
          )}

          {/* مؤشر السحب */}
          {isDragging && (
            <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium z-50 no-print">
              جاري السحب... ({draggedElement})
            </div>
          )}
        </div>

        {/* تعليمات السحب والإفلات المحسنة */}
        <div className="mt-3 md:mt-4 bg-gradient-to-r from-blue-50 to-yellow-50 p-3 md:p-4 rounded-xl border border-blue-100 no-print mobile-card">
          <div className="flex items-center gap-2 mb-3">
            <Move className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
            <h3 className="text-xs md:text-sm font-bold text-blue-800 mobile-text-base">تعليمات التحكم المحسنة</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-2 md:gap-3 text-xs mobile-text-sm">
            <div className="space-y-1">
              <p className="text-blue-700 font-medium">🔓 <strong>وضع التحرير:</strong> اضغط "مفتوح" للتحكم</p>
              <p className="text-blue-700 font-medium">🖱️ <strong>السحب:</strong> اضغط واسحب النص</p>
            </div>
            <div className="space-y-1">
              <p className="text-green-700 font-medium">🔒 <strong>وضع القفل:</strong> لمنع التحريك العرضي</p>
              <p className="text-green-700 font-medium">↩️ <strong>إعادة تعيين:</strong> لإرجاع المواضع الأصلية</p>
            </div>
          </div>
        </div>

        {/* معلومات المعاينة */}
        <div className="mt-4 md:mt-6 no-print">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 md:p-4 rounded-xl border border-green-200 mobile-card">
            <h3 className="font-bold text-green-800 mb-2 md:mb-3 text-xs md:text-sm flex items-center gap-2">
              <div className="bg-green-100 p-1 md:p-1.5 rounded-lg">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
              </div>
              المبلغ بالحروف
            </h3>
            <div className="bg-white/80 p-2 md:p-3 rounded-lg">
              <p className="text-green-700 font-medium text-xs md:text-sm leading-relaxed mobile-text-base" dir="ltr">
                {checkData.amount ? getAmountInWords() + ' دينار جزائري' : 'أدخل المبلغ لرؤية التحويل التلقائي'}
              </p>
            </div>
            {checkData.amount && (
              <div className="mt-2 md:mt-3 p-2 bg-green-100 rounded-lg">
                <p className="text-green-800 text-xs font-medium mobile-text-sm">
                  ✨ تم التحويل تلقائياً بواسطة النظام الذكي
                </p>
              </div>
            )}
          </div>
        </div>

        {/* تحذير الطباعة */}
        <div className="mt-3 md:mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 p-3 md:p-4 rounded-xl border border-yellow-200 no-print mobile-card">
          <div className="flex items-center gap-2 mb-2">
            <Printer className="w-3 h-3 md:w-4 md:h-4 text-yellow-600" />
            <h3 className="text-xs md:text-sm font-bold text-yellow-800 mobile-text-base">نصائح الطباعة</h3>
          </div>
          <div className="text-xs text-yellow-700 space-y-1 mobile-text-sm">
            <p>• سيتم طباعة قائمة بسيطة ومنظمة من البيانات</p>
            <p>• النصوص ستظهر بشكل واضح مع تسميات الحقول</p>
            <p>• لا توجد خلفيات أو صور في الطباعة</p>
          </div>
        </div>
      </div>

      {/* منطقة الطباعة المخفية - تظهر فقط عند الطباعة */}
      <div className="print-content">
        <div className="print-title">بيانات الشيك</div>
        
        {checkData.date && (
          <div className="print-item">
            <span className="print-label">التاريخ:</span>
            <span className="print-value">{formatDate(checkData.date)}</span>
          </div>
        )}
        
        {checkData.place && (
          <div className="print-item">
            <span className="print-label">مكان التحرير:</span>
            <span className="print-value">{checkData.place}</span>
          </div>
        )}
        
        {checkData.beneficiary && (
          <div className="print-item">
            <span className="print-label">المستفيد:</span>
            <span className="print-value">{checkData.beneficiary}</span>
          </div>
        )}
        
        {checkData.amount && (
          <div className="print-item">
            <span className="print-label">المبلغ:</span>
            <span className="print-value">{checkData.amount} دج</span>
          </div>
        )}
        
        {checkData.amount && (
          <div className="print-item">
            <span className="print-label">المبلغ بالحروف:</span>
            <span className="print-value">{getAmountInWords()} دينار جزائري</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckPreview;