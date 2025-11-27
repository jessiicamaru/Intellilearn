import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, User, LogIn, BookOpen } from 'lucide-react';

type UserRole = 'student' | 'teacher';

export default function StudentLogin() {
    const [userCode, setUserCode] = useState('');
    const [selectedRole, setSelectedRole] = useState<UserRole>('student');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (userCode.trim()) {
            navigate(`/profile?id=${userCode}&role=${selectedRole}`);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-3 sm:p-4 md:p-6">
            <Card className="w-full max-w-[95%] sm:max-w-md shadow-2xl border-0 overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6 md:p-8 text-white">
                    <div className="flex items-center justify-center mb-3 sm:mb-4">
                        <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-center">IntelliLearn</CardTitle>
                    <p className="text-center text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">Hệ thống học tập thông minh</p>
                </div>

                <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                    {/* Role Selection */}
                    <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-gray-700">Vai trò</Label>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <Button
                                variant={selectedRole === 'student' ? 'default' : 'outline'}
                                className={`h-16 sm:h-20 flex flex-col items-center justify-center gap-1.5 sm:gap-2 transition-all ${
                                    selectedRole === 'student'
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                                        : 'hover:border-blue-400 hover:bg-blue-50'
                                }`}
                                onClick={() => setSelectedRole('student')}
                            >
                                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="font-medium text-sm sm:text-base">Học sinh</span>
                            </Button>
                            <Button
                                variant={selectedRole === 'teacher' ? 'default' : 'outline'}
                                className={`h-16 sm:h-20 flex flex-col items-center justify-center gap-1.5 sm:gap-2 transition-all ${
                                    selectedRole === 'teacher'
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                                        : 'hover:border-purple-400 hover:bg-purple-50'
                                }`}
                                onClick={() => setSelectedRole('teacher')}
                            >
                                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="font-medium text-sm sm:text-base">Giáo viên</span>
                            </Button>
                        </div>
                    </div>

                    {/* User Code Input */}
                    <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor="userCode" className="text-xs sm:text-sm font-semibold text-gray-700">
                            {selectedRole === 'student' ? 'Mã học sinh' : 'Mã giáo viên'}
                        </Label>
                        <div className="relative">
                            <Input
                                id="userCode"
                                type="text"
                                placeholder={selectedRole === 'student' ? 'Ví dụ: S001' : 'Ví dụ: T001'}
                                value={userCode}
                                onChange={(e) => setUserCode(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="h-11 sm:h-12 text-base sm:text-lg pl-3 sm:pl-4 pr-10 sm:pr-12 border-2 focus:border-blue-500 transition-colors"
                            />
                            {userCode && (
                                <Badge variant="secondary" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-xs">
                                    {selectedRole === 'student' ? 'HS' : 'GV'}
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                            <span className="leading-tight">Nhập mã và nhấn Enter hoặc nút đăng nhập</span>
                        </p>
                    </div>

                    {/* Login Button */}
                    <Button
                        onClick={handleLogin}
                        disabled={!userCode.trim()}
                        className={`w-full h-11 sm:h-12 text-base sm:text-lg font-semibold transition-all ${
                            selectedRole === 'student'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        } ${!userCode.trim() ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}`}
                    >
                        <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Đăng nhập
                    </Button>

                    {/* Info Section */}
                    <div className="pt-3 sm:pt-4 border-t border-gray-200">
                        <div className="flex items-start gap-2 text-xs text-gray-600">
                            <div className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></div>
                            <p className="leading-tight">Hệ thống sẽ tự động điều hướng đến trang cá nhân của bạn sau khi đăng nhập</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
