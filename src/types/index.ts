export type UserRole = 'student' | 'faculty' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  department?: string;
  registrationNumber?: string; // e.g. KV2026/CS/1042
  avatar?: string;
  createdAt: string;
}

export type QuestionType =
  | 'multiple_choice' // Single correct choice
  | 'multiple_select' // Multiple correct choices
  | 'true_false'      // True / False
  | 'fill_blank'      // Fill in the blank
  | 'short_answer'    // Short text evaluation
  | 'essay'           // Descriptive answer
  | 'coding';         // Code challenge with runner

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  examId?: string;       // Optional if belonging to Question Bank
  subject?: string;      // e.g. Computer Science, Medicine, Pharmacy
  topic?: string;        // e.g. Data Structures, Clinical Pharmacology
  section: string;       // Section name within exam (e.g. Core Knowledge)
  type: QuestionType;
  text: string;
  options?: string[];    // For multiple choice & true/false
  correctAnswer: string; // Correct answer or comma-separated keys
  explanation?: string;  // Detailed solution explanation
  marks: number;         // Positive marks
  negativeMarks?: number;// Deduction if wrong
  difficulty: DifficultyLevel;
  codeLanguage?: string;
  starterCode?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  subject: string;
  department: string;
  instructions?: string;
  durationMinutes: number;
  passMarks: number;
  totalMarks: number;
  creatorId: string;
  creatorName: string;
  status: 'draft' | 'published' | 'active' | 'completed';
  randomizeOrder: boolean;
  randomizeOptions?: boolean;
  enableWebcam: boolean;
  enableFullScreen: boolean;
  strictAntiCheat: boolean;
  negativeMarking: boolean;
  negativeMarkValue: number;
  sections: string[];
  questionIds?: string[]; // IDs of questions linked to this exam
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
  answers: Record<string, any>; // questionId -> answer string | string[]
  questionOrder?: string[];     // Consistent randomized order for this attempt
  markedForReview: string[];
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  accuracy?: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  violationCount: number;
  currentQuestionIndex: number;
  remainingSeconds: number;
  startedAt: string;
  expectedEndTime?: string;     // Source of truth for timer
  submittedAt?: string;
  timeTakenSeconds?: number;
  subjectBreakdown?: Record<string, { total: number; scored: number }>;
  topicBreakdown?: Record<string, { total: number; scored: number; accuracy: number }>;
}

export interface ViolationLog {
  id: string;
  attemptId: string;
  examId: string;
  studentId: string;
  studentName?: string;
  reason: string;
  warningLevel: number; // 1 to 4
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
  entityType: 'exam' | 'attempt' | 'question' | 'security' | 'user';
  entityId: string;
  timestamp: string;
  details?: string;
}

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  department: string;
  topics: string[];
  examCount: number;
  questionCount: number;
}
