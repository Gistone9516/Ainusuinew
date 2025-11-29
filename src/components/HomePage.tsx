import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  TrendingUp,
  Award,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Activity,
  BarChart3,
  ArrowUp,
  Medal, // Added Medal icon
} from "lucide-react";
import type { UserData, Page } from "../App";
import { useState } from "react";
import { AppHeader } from "./AppHeader";
import { motion } from "framer-motion";

interface HomePageProps {
  userData: UserData;
  onNavigate: (page: Page) => void;
  onSelectCluster: (cluster: any) => void;
}

export function HomePage({
  userData,
  onNavigate,
  onSelectCluster,
}: HomePageProps) {
  const [currentSection, setCurrentSection] = useState(0);

  // Mock data
  const issueIndex = 72;
  const topModels = [
    { name: "GPT-4 Turbo", score: 95, category: "대화형 AI" },
    { name: "Claude 3 Opus", score: 93, category: "대화형 AI" },
    { name: "Gemini Ultra", score: 91, category: "멀티모달" },
  ];

  const topNews = [
    {
      title: "OpenAI, GPT-5 개발 본격화... 성능 대폭 향상 전망",
      tags: ["LLM", "모델출시", "기술트렌드"],
      score: 89,
      date: "2025-11-21",
    },
    {
      title: "AI 규제 법안 국회 통과... 개발자들 우려 ��명",
      tags: ["AI규제", "AI윤리", "AI일자리"],
      score: 85,
      date: "2025-11-20",
    },
    {
      title: "의료 AI 진단 정확도 95% 돌파... 임상 적용 확대",
      tags: ["의료진단", "컴퓨터비전", "AI성능"],
      score: 82,
      date: "2025-11-20",
    },
  ];

  // Gauge data for RadialBarChart
  const gaugeData = [
    {
      name: "index",
      value: issueIndex,
      fill: issueIndex >= 75 ? "#dc2626" : issueIndex >= 50 ? "#ca8a04" : "#16a34a",
    },
  ];

  const getIndexColor = (index: number) => {
    if (index >= 75) return "text-red-600";
    if (index >= 50) return "text-yellow-600";
    return "text-green-600";
  };

  const getIndexBg = (index: number) => {
    if (index >= 75) return "bg-red-50";
    if (index >= 50) return "bg-yellow-50";
    return "bg-green-50";
  };

  const getIndexLabel = (index: number) => {
    if (index >= 75) return "경계";
    if (index >= 50) return "주의";
    return "안정";
  };

  const totalSections = 3;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const sectionWidth = container.offsetWidth;
    const newSection = Math.round(scrollLeft / sectionWidth);
    setCurrentSection(newSection);
  };

  const scrollToSection = (index: number) => {
    const container = document.getElementById(
      "horizontal-scroll-container",
    );
    if (container) {
      const sectionWidth = container.offsetWidth;
      container.scrollTo({
        left: sectionWidth * index,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="h-screen flex flex-col pb-20">
      {/* Header - Fixed */}
      <AppHeader userData={userData} onNavigate={onNavigate} />

      {/* Horizontal Scroll Container */}
      <div
        id="horizontal-scroll-container"
        className="flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="flex h-full">
          {/* Section 1: AI Issue Index */}
          <div className="flex-shrink-0 w-full h-full snap-center px-4">
            <div className="h-full flex flex-col justify-center">
              <Card
                className="shadow-lg cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02]"
                onClick={() => onNavigate("issue")}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    <CardTitle>오늘의 이슈지수</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 프로그레스 바 게이지 (숫자 위) */}
                    <div className="space-y-3">
                      {/* 프로그레스 바 */}
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <motion.div
                          className={`h-4 rounded-full ${
                            issueIndex >= 75 ? "bg-red-500" :
                            issueIndex >= 50 ? "bg-yellow-500" :
                            "bg-green-500"
                          }`}
                          initial={{ width: "0%" }}
                          animate={{ width: `${issueIndex}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </div>

                      {/* 0과 100 표시 */}
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span>100</span>
                      </div>
                      
                      {/* 숫자 표시 */}
                      <div className="text-center">
                        <motion.div 
                          className={`text-5xl ${getIndexColor(issueIndex)}`}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          {issueIndex}
                        </motion.div>
                        <div className="text-sm text-muted-foreground mt-1" style={{ fontWeight: '700' }}>
                          {getIndexLabel(issueIndex)} 단계
                        </div>
                      </div>
                    </div>

                    {/* 전일 대비 변화 */}
                    <div className="flex items-center justify-center gap-1 text-sm text-red-600">
                      <ArrowUp className="h-4 w-4" />
                      <span>전일 대비 +3점 상승</span>
                    </div>

                    {/* 통계 카드 */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 rounded-lg bg-gray-50">
                        <BarChart3 className="h-4 w-4 text-indigo-600 mx-auto mb-1" />
                        <div className="text-xl">12</div>
                        <div className="text-xs text-muted-foreground mt-1">활성 클러스터</div>
                      </div>

                      <div className="text-center p-3 rounded-lg bg-gray-50">
                        <Newspaper className="h-4 w-4 text-indigo-600 mx-auto mb-1" />
                        <div className="text-xl">3.2k</div>
                        <div className="text-xs text-muted-foreground mt-1">분석 기사</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section 2: Top AI Models */}
          <div className="flex-shrink-0 w-full h-full snap-center px-4">
            <div className="h-full flex flex-col justify-center">
              <Card
                className="shadow-lg cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02]"
                onClick={() => onNavigate("model")}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-indigo-600" />
                    <CardTitle>
                      오늘의 AI 모델 벤치마크
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topModels.map((model, index) => (
                    <div
                      key={model.name}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Gold, Silver, Bronze circles with numbers */}
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            index === 0
                              ? "bg-yellow-400 text-white"
                              : index === 1
                                ? "bg-gray-400 text-white"
                                : "bg-orange-400 text-white"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-sm">
                            {model.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {model.category}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-sm px-3 py-1"
                      >
                        {model.score}점
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section 3: Top News */}
          <div className="flex-shrink-0 w-full h-full snap-center px-4">
            <div className="h-full flex flex-col justify-center">
              <Card
                className="shadow-lg cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02]"
                onClick={() => onNavigate("issue")}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-indigo-600" />
                    <CardTitle>오늘의 AI 이슈 뉴스</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {topNews.map((news, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border hover:border-indigo-300 transition-colors cursor-pointer bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCluster({
                          title: news.title,
                          tags: news.tags,
                          score: news.score,
                          articles: 5,
                          createdAt: news.date,
                          updatedAt: news.date
                        });
                      }}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <h3 className="flex-1 pr-4 text-sm">
                          {news.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {news.score}점
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        {news.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {news.date}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex-shrink-0 flex items-center justify-center gap-2 py-4 bg-white">
        {Array.from({ length: totalSections }).map(
          (_, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={`h-2 rounded-full transition-all ${
                currentSection === index
                  ? "w-8 bg-indigo-600"
                  : "w-2 bg-gray-300"
              }`}
              aria-label={`섹션 ${index + 1}로 이동`}
            />
          ),
        )}
      </div>

      {/* Navigation Arrows */}
      {currentSection > 0 && (
        <button
          onClick={() => scrollToSection(currentSection - 1)}
          className="fixed left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          aria-label="이전 섹션"
        >
          <ChevronLeft className="h-6 w-6 text-indigo-600" />
        </button>
      )}

      {currentSection < totalSections - 1 && (
        <button
          onClick={() => scrollToSection(currentSection + 1)}
          className="fixed right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          aria-label="다음 섹션"
        >
          <ChevronRight className="h-6 w-6 text-indigo-600" />
        </button>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}