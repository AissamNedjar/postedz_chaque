import React, { useState, useEffect } from 'react';
import CheckForm from './components/CheckForm';
import CheckPreview from './components/CheckPreview';
import { FileText, Sparkles } from 'lucide-react';

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

function App() {
  const [checkData, setCheckData] = useState<CheckData>({
    date: '',
    place: 'الجزائر',
    beneficiary: 'عصام نجار',
    amount: '5000'
  });

  const [positions, setPositions] = useState<Record<string, Position>>({
    date: { x: 2, y: 26 },
    place: { x: 62, y: 26 },
    beneficiary: { x: -2, y: 0 },
    amount: { x: 69, y: -47 },
    amountWords: { x: 30, y: -34 }
  });

  const [showPositionControls, setShowPositionControls] = useState(false);

  // تعيين التاريخ الحالي بالتنسيق الجزائري
  useEffect(() => {
    const today = new Date();
    const algerianDate = today.toLocaleDateString('en-CA'); // YYYY-MM-DD format for input
    setCheckData(prev => ({ ...prev, date: algerianDate }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* الرأس */}
      <header className="relative z-10 bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 slide-in">
              <div className="bg-blue-600 p-1.5 md:p-2 rounded-xl shadow-lg">
                <img 
                  src="https://www.poste.dz/images/logo-round.png" 
                  alt="بريد الجزائر" 
                  className="w-6 h-6 md:w-8 md:h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">شيك بريد الجزائر</h1>
                <p className="text-xs md:text-sm text-gray-600 font-medium hidden sm:block">نظام ملء الشيكات الإلكتروني</p>
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2 text-blue-600 slide-in" style={{ animationDelay: '0.2s' }}>
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm font-bold hidden sm:inline">تحويل تلقائي للأرقام</span>
              <span className="text-xs font-bold sm:hidden">تحويل تلقائي</span>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="grid lg:grid-cols-2 gap-4 md:gap-8 mobile-grid">
          {/* قسم النموذج */}
          <div className="space-y-4 md:space-y-6 fade-in">
            <CheckForm
              checkData={checkData}
              setCheckData={setCheckData}
              positions={positions}
              setPositions={setPositions}
              showPositionControls={showPositionControls}
              setShowPositionControls={setShowPositionControls}
            />
            
            {/* التعليمات */}
            <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-2xl p-4 md:p-6 border border-blue-100 hover-lift mobile-card">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                دليل الاستخدام
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <div>
                      <h4 className="font-bold text-gray-800 text-xs md:text-sm">إدخال البيانات</h4>
                      <p className="text-gray-600 text-xs mobile-text-sm">املأ جميع الحقول المطلوبة في النموذج</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-yellow-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <div>
                      <h4 className="font-bold text-gray-800 text-xs md:text-sm">المعاينة المباشرة</h4>
                      <p className="text-gray-600 text-xs mobile-text-sm">شاهد النتيجة فوراً في معاينة الشيك</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <div>
                      <h4 className="font-bold text-gray-800 text-xs md:text-sm">السحب والإفلات</h4>
                      <p className="text-gray-600 text-xs mobile-text-sm">اسحب النصوص بالفأرة لتحديد مواضعها</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-yellow-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <div>
                      <h4 className="font-bold text-gray-800 text-xs md:text-sm">الطباعة والحفظ</h4>
                      <p className="text-gray-600 text-xs mobile-text-sm">اطبع الشيك أو احفظه للاستخدام لاحقاً</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* قسم المعاينة */}
          <div className="space-y-4 md:space-y-6 fade-in" style={{ animationDelay: '0.3s' }}>
            <CheckPreview 
              checkData={checkData} 
              positions={positions}
              setPositions={setPositions}
            />
          </div>
        </div>
      </main>

      {/* التذييل */}
      <footer className="relative z-10 bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-8 md:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 md:p-2 rounded-xl">
                  <img 
                    src="https://www.poste.dz/images/logo-round.png" 
                    alt="بريد الجزائر" 
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                </div>
                <h3 className="text-base md:text-lg font-bold">شيك بريد الجزائر</h3>
              </div>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                تطبيق متطور ومتخصص في ملء شيكات بريد الجزائر بشكل احترافي ودقيق، مع إمكانيات تحكم متقدمة وواجهة سهلة الاستخدام.
              </p>
            </div>
            
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-base md:text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                المميزات الرئيسية
              </h3>
              <ul className="space-y-1 text-gray-300 text-xs md:text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                  تحويل تلقائي للأرقام إلى كلمات عربية
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-yellow-400 rounded-full flex-shrink-0"></div>
                  معاينة مباشرة للشيك
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
                  تحكم بالفأرة في مواضع النصوص
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-purple-400 rounded-full flex-shrink-0"></div>
                  واجهة عربية متجاوبة وأنيقة
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-4 md:mt-6 pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-gray-400 text-xs md:text-sm">
                © 2024 جميع الحقوق محفوظة - تم التطوير بواسطة 
                <a href="https://aissam.dev" className="text-yellow-400 hover:text-yellow-300 font-bold mr-1">Aissam Nedjar</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;