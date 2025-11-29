import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tag, ChevronLeft } from 'lucide-react';
import { Badge } from './ui/badge';

interface OnboardingTagsProps {
  userJob: string;
  onNext: (tags: string[]) => void;
  onBack: () => void;
}

const jobTagsMap: Record<string, string[]> = {
  tech: ['LLM', '컴퓨터비전', '자연어처리', '머신러닝', '코드생성', '모델경량화', '에지AI', '오픈소스'],
  creative: ['콘텐츠생성', '이미지생성', '영상생성', '글쓰기지원', '마케팅자동화', '검색최적화'],
  analysis: ['데이터분석', '예측분석', '자동화', '업무효율화', '의사결정지원'],
  healthcare: ['컴퓨터비전', '의료진단', '데이터분석', '머신러닝'],
  education: ['채팅봇', '교육지원', '글쓰기지원', '자동화'],
  business: ['데이터분석', '예측분석', '의사결정지원', '자동화', '마케팅자동화', '가격결정'],
  manufacturing: ['컴퓨터비전', '자동화', '데이터분석', '모델경량화'],
  service: ['채팅봇', '감정분석', '자동화', '마케팅자동화'],
  startup: ['자동화', '업무효율화', '의사결정지원', '데이터분석', '비용절감'],
  agriculture: ['컴퓨터비전', '데이터분석', '자동화'],
  fisheries: ['데이터분석', '자동화', '예측분석'],
  student: ['교육지원', '글쓰기지원', '코드생성', 'LLM'],
  others: ['기술트렌드', '자동화', '데이터분석'],
};

const allTags = [
  'LLM', '컴퓨터비전', '자연어처리', '머신러닝', '강화학습', '연합학습',
  '모델경량화', '프롬프트엔지니어링', '에지AI', '윤리AI', 'AI보안', '개인화추천',
  '콘텐츠생성', '이미지생성', '영상생성', '코드생성', '글쓰기지원', '번역',
  '음성합성', '음성인식', '채팅봇', '감정분석', '데이터분석', '예측분석',
  '자동화', '업무효율화', '의사결정지원', '마케팅자동화', '검색최적화', '가격결정',
  'AI일자리', 'AI윤리', 'AI규제', 'AI성능', '모델출시', '오픈소스',
  '의료진단', '교육지원', '비용절감', '기술트렌드',
];

export function OnboardingTags({ userJob, onNext, onBack }: OnboardingTagsProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const fixedTags = jobTagsMap[userJob] || [];

  useEffect(() => {
    setSelectedTags([...fixedTags]);
  }, [userJob]);

  const toggleTag = (tag: string) => {
    if (fixedTags.includes(tag)) return; // 고정 태그는 토글 불가
    
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <Button variant="ghost" className="w-fit -ml-2 mb-2" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            뒤로
          </Button>
          <div className="mx-auto mb-4 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <Tag className="h-6 w-6 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl">관심 있는 뉴스 태그를 선택하세요</CardTitle>
          <CardDescription>직업에 따라 일부 태그가 자동 선택되며, 추가로 선택 가능합니다</CardDescription>
          <div className="text-sm text-muted-foreground mt-2">3/3 단계</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <p className="text-sm mb-2">선택된 태그 ({selectedTags.length}개)</p>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant={fixedTags.includes(tag) ? "default" : "secondary"}>
                  {tag}
                  {fixedTags.includes(tag) && <span className="ml-1 text-xs">(고정)</span>}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto p-2">
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const isFixed = fixedTags.includes(tag);
                const isSelected = selectedTags.includes(tag);
                
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    disabled={isFixed}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      isFixed
                        ? 'bg-indigo-600 text-white cursor-not-allowed'
                        : isSelected
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
          
          <Button
            onClick={() => onNext(selectedTags)}
            className="w-full"
          >
            시작하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
