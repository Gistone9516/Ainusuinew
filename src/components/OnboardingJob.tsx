import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Briefcase, ChevronLeft } from 'lucide-react';

interface OnboardingJobProps {
  onNext: (job: string) => void;
  onBack: () => void;
}

export function OnboardingJob({ onNext, onBack }: OnboardingJobProps) {
  const [selectedJob, setSelectedJob] = useState('');

  const jobs = [
    { value: 'tech', label: '기술/개발' },
    { value: 'creative', label: '창작/콘텐츠' },
    { value: 'analysis', label: '분석/사무' },
    { value: 'healthcare', label: '의료/과학' },
    { value: 'education', label: '교육' },
    { value: 'business', label: '비즈니스' },
    { value: 'manufacturing', label: '제조/건설' },
    { value: 'service', label: '서비스' },
    { value: 'startup', label: '창업/자영업' },
    { value: 'agriculture', label: '농업/축산업' },
    { value: 'fisheries', label: '어업/해상업' },
    { value: 'student', label: '학생' },
    { value: 'others', label: '기타' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button variant="ghost" className="w-fit -ml-2 mb-2" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            뒤로
          </Button>
          <div className="mx-auto mb-4 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl">직업을 선택해주세요</CardTitle>
          <CardDescription>직업별 맞춤 AI 정보를 제공합니다</CardDescription>
          <div className="text-sm text-muted-foreground mt-2">2/3 단계</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {jobs.map((job) => (
              <button
                key={job.value}
                onClick={() => setSelectedJob(job.value)}
                className={`p-3 rounded-lg border-2 transition-all text-sm ${
                  selectedJob === job.value
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {job.label}
              </button>
            ))}
          </div>
          <Button
            onClick={() => selectedJob && onNext(selectedJob)}
            disabled={!selectedJob}
            className="w-full"
          >
            다음
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
