export type UserRole = 'student' | 'faculty' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  createdAt: string;
}

export type QuestionType =
  | 'multiple_choice'
  | 'multiple_select'
  | 'true_false'
  | 'fill_blank'
  | 'short_answer'
  | 'essay'
  | 'coding';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  examId: string;
  section: string;
  type: QuestionType;
  text: string;
  options?: string[]; // for choice questions
  correctAnswer: string; // or comma-separated string for multi-select
  explanation?: string;
  marks: number;
  difficulty: DifficultyLevel;
  codeLanguage?: string;
  starterCode?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  subject: string;
  department: string;
  durationMinutes: number;
  passMarks: number;
  totalMarks: number;
  creatorId: string;
  creatorName: string;
  status: 'draft' | 'published' | 'active' | 'completed';
  randomizeOrder: boolean;
  enableWebcam: boolean;
  enableFullScreen: boolean;
  strictAntiCheat: boolean;
  negativeMarking: boolean;
  negativeMarkValue: number;
  sections: string[];
  scheduleStart?: string;
  scheduleEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: 'in_progress' | 'submitted' | 'auto_submitted' | 'disqualified';
  answers: Record<string, string | string[]>;
  markedForReview: string[];
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  violationCount: number;
  currentQuestionIndex: number;
  remainingSeconds: number;
  startedAt: string;
  submittedAt?: string;
  subjectBreakdown?: Record<string, { total: number; scored: number }>;
}

export interface ViolationLog {
  id: string;
  attemptId: string;
  examId: string;
  studentId: string;
  studentName?: string;
  reason: string;
  warningLevel: number; // 1, 2, 3, 4
  browserInfo: string;
  timestamp: string;
}

export interface Certificate {
  id: string;
  attemptId: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  issuedAt: string;
  verificationCode: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface SystemAuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'exam' | 'attempt' | 'question' | 'security';
  entityId: string;
  timestamp: string;
  details?: string;
}
