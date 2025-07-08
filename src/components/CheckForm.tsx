import React from 'react';
import { Calendar, MapPin, User, DollarSign, Settings, Sparkles } from 'lucide-react';

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

interface CheckFormProps {
  checkData: CheckData;
  setCheckData: (data: CheckData) => void;
  positions: Record<string, Position>;
  setPositions: (positions: Record<string, Position>) => void;
  showPositionControls: boolean;
  setShowPositionControls: (show: boolean) => void;
}

const CheckForm: React.FC<CheckFormProps> = ({
  checkData,
  setCheckData,
  positions,
  setPositions,
  showPositionControls,
  setShowPositionControls
}) => {
  const handleInputChange = (field: keyof CheckData, value: string) => {
    setCheckData({
      ...checkData,
      [field]: value
    });
  };

  const handlePositionChange = (field: string, axis: 'x' | 'y', value: number) => {
    setPositions({
      ...positions,
      [field]: {
        ...positions[field],
        [axis]: value
      }
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 md:p-6 space-y-4 md:space-y-6 border border-white/20 hover-lift mobile-card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 md:p-2 rounded-xl">
            <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          بيانات الشيك
        </h2>
        <button
          onClick={() => setShowPositionControls(!showPositionControls)}
          className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-xl font-medium text-xs md:text-sm transition-all duration-300 transform hover:scale-105 mobile-button ${
            showPositionControls
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-yellow-500 text-white hover:bg-yellow-600'
          }`}
        >
          <Settings className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">التحكم في المواضع</span>
          <span className="sm:hidden">المواضع</span>
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 md:gap-4 mobile-grid">
        {/* تاريخ الشيك */}
        <div className="space-y-2 mobile-spacing">
          <label className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-700">
            <div className="bg-blue-100 p-1 md:p-1.5 rounded-lg">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
            </div>
            تاريخ الشيك
          </label>
          <input
            type="date"
            value={checkData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm font-medium bg-white/80 backdrop-blur-sm mobile-input"
          />
          {showPositionControls && (
            <div className="bg-gradient-to-r from-blue-50 to-yellow-50 p-2 md:p-3 rounded-xl space-y-2 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600" />
                <span className="text-xs font-bold text-blue-800 mobile-text-sm">ضبط موضع التاريخ</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block mobile-text-sm">الموضع الأفقي</label>
                  <input
                    type="number"
                    value={positions.date?.x || 0}
                    onChange={(e) => handlePositionChange('date', 'x', parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border-2 border-blue-200 rounded-lg focus:border-blue-500 transition-all duration-200 mobile-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block mobile-text-sm">الموضع العمودي</label>
                  <input
                    type="number"
                    value={positions.date?.y || 0}
                    onChange={(e) => handlePositionChange('date', 'y', parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border-2 border-blue-200 rounded-lg focus:border-blue-500 transition-all duration-200 mobile-input"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* مكان التحرير */}
        <div className="space-y-2 mobile-spacing">
          <label className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-700">
            <div className="bg-green-100 p-1 md:p-1.5 rounded-lg">
              <MapPin className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
            </div>
            مكان التحرير
          </label>
          <input
            type="text"
            value={checkData.place}
            onChange={(e) => handleInputChange('place', e.target.value)}
            placeholder="مثال: الجزائر العاصمة"
            className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-sm font-medium bg-white/80 backdrop-blur-sm mobile-input"
          />
          {showPositionControls && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-2 md:p-3 rounded-xl space-y-2 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-600" />
                <span className="text-xs font-bold text-green-800 mobile-text-sm">ضبط موضع المكان</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block mobile-text-sm">الموضع الأفقي</label>
                  <input
                    type="number"
                    value={positions.place?.x || 0}
                    onChange={(e) => handlePositionChange('place', 'x', parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border-2 border-green-200 rounded-lg focus:border-green-500 transition-all duration-200 mobile-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block mobile-text-sm">الموضع العمودي</label>
                  <input
                    type="number"
                    value={positions.place?.y || 0}
                    onChange={(e) => handlePositionChange('place', 'y', parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border-2 border-green-200 rounded-lg focus:border-green-500 transition-all duration-200 mobile-input"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* اسم المستفيد */}
        <div className="space-y-2 mobile-spacing">
          <label className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-700">
            <div className="bg-purple-100 p-1 md:p-1.5 rounded-lg">
              <User className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
            </div>
            اسم المستفيد
          </label>
          <input
            type="text"
            value={checkData.beneficiary}
            onChange={(e) => handleInputChange('beneficiary', e.target.value)}
            placeholder="مثال: أحمد بن محمد"
            className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-sm font-medium bg-white/80 backdrop-blur-sm mobile-input"
          />
          {showPositionControls && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-2 md:p-3 rounded-xl space-y-2 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-purple-600" />
                <span className="text-xs font-bold text-purple-800 mobile-text-sm">ضبط موضع المستفيد</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block mobile-text-sm">الموضع الأفقي</label>
                  <input
                    type="number"
                    value={positions.beneficiary?.x || 0}
                    onChange={(e) => handlePositionChange('beneficiary', 'x', parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border-2 border-purple-200 rounded-lg focus:border-purple-500 transition-all duration-200 mobile-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block mobile-text-sm">الموضع العمودي</label>
                  <input
                    type="number"
                    value={positions.beneficiary?.y || 0}
                    onChange={(e) => handlePositionChange('beneficiary', 'y', parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border-2 border-purple-200 rounded-lg focus:border-purple-500 transition-all duration-200 mobile-input"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* المبلغ */}
        <div className="space-y-2 mobile-spacing">
          <label className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-700">
            <div className="bg-yellow-100 p-1 md:p-1.5 rounded-lg">
              <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-yellow-600" />
            </div>
            المبلغ (بالدينار الجزائري)
          </label>
          <input
            type="number"
            value={checkData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            placeholder="مثال: 15000"
            className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-300 text-sm font-medium bg-white/80 backdrop-blur-sm mobile-input"
          />
          {showPositionControls && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-2 md:p-3 rounded-xl space-y-2 border border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-yellow-600" />
                <span className="text-xs font-bold text-yellow-800 mobile-text-sm">ضبط موضع المبلغ</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block mobile-text-sm">الموضع الأفقي</label>
                  <input
                    type="number"
                    value={positions.amount?.x || 0}
                    onChange={(e) => handlePositionChange('amount', 'x', parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border-2 border-yellow-200 rounded-lg focus:border-yellow-500 transition-all duration-200 mobile-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block mobile-text-sm">الموضع العمودي</label>
                  <input
                    type="number"
                    value={positions.amount?.y || 0}
                    onChange={(e) => handlePositionChange('amount', 'y', parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border-2 border-yellow-200 rounded-lg focus:border-yellow-500 transition-all duration-200 mobile-input"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* التحكم في موضع المبلغ بالحروف */}
      {showPositionControls && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 md:p-4 rounded-xl border border-orange-100 mobile-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-orange-100 p-1 md:p-1.5 rounded-lg">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-orange-600" />
            </div>
            <h3 className="text-xs md:text-sm font-bold text-orange-800 mobile-text-base">ضبط موضع المبلغ بالحروف</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block mobile-text-sm">الموضع الأفقي</label>
              <input
                type="number"
                value={positions.amountWords?.x || 0}
                onChange={(e) => handlePositionChange('amountWords', 'x', parseInt(e.target.value))}
                className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border-2 border-orange-200 rounded-lg focus:border-orange-500 transition-all duration-200 mobile-input"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block mobile-text-sm">الموضع العمودي</label>
              <input
                type="number"
                value={positions.amountWords?.y || 0}
                onChange={(e) => handlePositionChange('amountWords', 'y', parseInt(e.target.value))}
                className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border-2 border-orange-200 rounded-lg focus:border-orange-500 transition-all duration-200 mobile-input"
              />
            </div>
          </div>
        </div>
      )}

      {showPositionControls && (
        <div className="bg-gradient-to-r from-blue-50 to-yellow-50 p-3 md:p-4 rounded-xl border border-blue-100 mobile-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-600 p-1 md:p-1.5 rounded-lg">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
            </div>
            <h3 className="text-xs md:text-sm font-bold text-blue-800 mobile-text-base">نصائح التحكم في المواضع</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-2 md:gap-3 text-xs mobile-text-sm">
            <div className="space-y-1">
              <p className="text-blue-700 font-medium">• استخدم الأرقام الموجبة للتحرك يميناً وأسفل</p>
              <p className="text-blue-700 font-medium">• استخدم الأرقام السالبة للتحرك يساراً وأعلى</p>
            </div>
            <div className="space-y-1">
              <p className="text-yellow-700 font-medium">• اسحب النصوص بالفأرة لتحديد مواضعها</p>
              <p className="text-yellow-700 font-medium">• شاهد التغييرات مباشرة في معاينة الشيك</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckForm;