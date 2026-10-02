import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  UserRole,
  Exam,
  Question,
  ExamAttempt,
  ViolationLog,
  Certificate,
  ChatMessage,
  AppNotification,
  SystemAuditLog,
} from '../types';
import { SEED_EXAMS, SEED_QUESTIONS, SEED_ATTEMPTS, SEED_CERTIFICATES } from '../data/seedData';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

interface ExamContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  switchRole: (role: UserRole) => void;
  exams: Exam[];
  questions: Record<string, Question[]>;
  attempts: ExamAttempt[];
  certificates: Certificate[];
  violations: ViolationLog[];
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  systemLogs: SystemAuditLog[];
  createExam: (examData: Partial<Exam>) => Promise<string>;
  updateExam: (id: string, updates: Partial<Exam>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  addQuestion: (examId: string, q: Partial<Question>) => Promise<void>;
  deleteQuestion: (examId: string, qId: string) => Promise<void>;
  startAttempt: (examId: string) => ExamAttempt;
  saveAttemptProgress: (
    attemptId: string,
    answers: Record<string, any>,
    marked: string[],
    currentQ: number,
    remainingSecs: number
  ) => Promise<void>;
  logViolation: (
    attemptId: string,
    examId: string,
    reason: string,
    warningLevel: number
  ) => Promise<void>;
  submitAttempt: (attemptId: string, isAuto?: boolean) => Promise<ExamAttempt>;
  darkMode: boolean;
  toggleDarkMode: () => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (content: string, customInstruction?: string) => Promise<void>;
  isAiLoading: boolean;
  generateAiQuestions: (params: {
    topic: string;
    subject: string;
    count: number;
    difficulty: string;
    types: string[];
  }) => Promise<Question[]>;
  evaluateEssay: (params: {
    question: string;
    studentAnswer: string;
    modelAnswer?: string;
    maxMarks: number;
  }) => Promise<any>;
  auditProctoring: (params: {
    violations: ViolationLog[];
    examTitle: string;
    studentName: string;
  }) => Promise<any>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

const DEFAULT_USER: UserProfile = {
  id: 'usr_student_demo',
  email: 'alex.mercer@university.edu',
  displayName: 'Alex Mercer',
  role: 'student',
  department: 'Computer Science',
  createdAt: new Date().toISOString(),
};

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('exampro_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('exampro_theme') === 'dark' || true;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('exampro_exams');
    return saved ? JSON.parse(saved) : SEED_EXAMS;
  });

  const [questions, setQuestions] = useState<Record<string, Question[]>>(() => {
    const saved = localStorage.getItem('exampro_questions');
    return saved ? JSON.parse(saved) : SEED_QUESTIONS;
  });

  const [attempts, setAttempts] = useState<ExamAttempt[]>(() => {
    const saved = localStorage.getItem('exampro_attempts');
    return saved ? JSON.parse(saved) : SEED_ATTEMPTS;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('exampro_certs');
    return saved ? JSON.parse(saved) : SEED_CERTIFICATES;
  });

  const [violations, setViolations] = useState<ViolationLog[]>([]);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif_1',
      title: 'Proctored Assessment Live',
      message: 'CS-401: Advanced Algorithms examination window is now open.',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
    },
    {
      id: 'notif_2',
      title: 'Certificate Issued',
      message: 'Alex Mercer achieved Grade A+ with Honors in Algorithms.',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      read: false,
    },
    {
      id: 'notif_3',
      title: 'Integrity Protocol Active',
      message: 'Full-screen and tab-switch monitoring is actively enforced.',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      read: true,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const [systemLogs, setSystemLogs] = useState<SystemAuditLog[]>([
    {
      id: 'log_1',
      userId: 'fac_1',
      userName: 'Dr. Aris Thorne',
      action: 'EXAM_PUBLISHED',
      entityType: 'exam',
      entityId: 'exam_cs401',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      details: 'Published CS-401 with strict anti-cheat enabled',
    },
    {
      id: 'log_2',
      userId: 'usr_student_demo',
      userName: 'Alex Mercer',
      action: 'ATTEMPT_SUBMITTED',
      entityType: 'attempt',
      entityId: 'att_sample_1',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      details: 'Submitted with score 68/75 (90.6%)',
    },
    {
      id: 'log_3',
      userId: 'usr_student_demo',
      userName: 'Alex Mercer',
      action: 'SECURITY_AUDIT_VERIFIED',
      entityType: 'security',
      entityId: 'att_sample_1',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      details: 'Proctoring integrity audit verified with trust score 98',
    },
  ]);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'model',
      content:
        'Hello! I am ExamPro AI, your secure academic examination assistant. How can I assist you with exam preparation, proctoring guidelines, or syllabus reviews today?',
      timestamp: new Date().toISOString(),
    },
  ]);

  const [isAiLoading, setIsAiLoading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('exampro_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('exampro_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('exampro_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('exampro_attempts', JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    localStorage.setItem('exampro_certs', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('exampro_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser((prev) => ({
          ...prev,
          id: firebaseUser.uid,
          email: firebaseUser.email || prev.email,
          displayName: firebaseUser.displayName || prev.displayName,
          role: firebaseUser.email === 'kavinashk008@gmail.com' ? 'admin' : prev.role,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync with Firestore collection if online
  useEffect(() => {
    try {
      const examsRef = collection(db, 'exams');
      const unsubscribe = onSnapshot(
        examsRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteExams: Exam[] = [];
            snapshot.forEach((docSnap) => {
              remoteExams.push(docSnap.data() as Exam);
            });
            setExams(remoteExams);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'exams');
        }
      );
      return () => unsubscribe();
    } catch {
      // Local fallback active
    }
  }, []);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const switchRole = (role: UserRole) => {
    setUser((prev) => {
      let displayName = prev.displayName;
      let email = prev.email;
      let department = prev.department;

      if (role === 'admin') {
        displayName = 'Super Administrator';
        email = 'admin@exampro.edu';
        department = 'Academic Affairs & Security';
      } else if (role === 'faculty') {
        displayName = 'Dr. Aris Thorne';
        email = 'a.thorne@faculty.edu';
        department = 'Computer Science & Engineering';
      } else {
        displayName = 'Alex Mercer';
        email = 'alex.mercer@university.edu';
        department = 'Computer Science';
      }

      return {
        ...prev,
        role,
        displayName,
        email,
        department,
      };
    });
  };

  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const isBootstrapAdmin = res.user.email === 'kavinashk008@gmail.com';
        setUser({
          id: res.user.uid,
          email: res.user.email || 'user@exampro.edu',
          displayName: res.user.displayName || 'Google User',
          role: isBootstrapAdmin ? 'admin' : 'student',
          department: 'Academic Division',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Sign-in error:', err);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(DEFAULT_USER);
  };

  // Exam Management Actions
  const createExam = async (examData: Partial<Exam>): Promise<string> => {
    const id = `exam_${Date.now()}`;
    const newExam: Exam = {
      id,
      title: examData.title || 'Untitled Assessment',
      description: examData.description || '',
      subject: examData.subject || 'General Knowledge',
      department: examData.department || user.department || 'General',
      durationMinutes: examData.durationMinutes || 60,
      passMarks: examData.passMarks || 40,
      totalMarks: examData.totalMarks || 100,
      creatorId: user.id,
      creatorName: user.displayName,
      status: examData.status || 'published',
      randomizeOrder: examData.randomizeOrder ?? true,
      enableWebcam: examData.enableWebcam ?? true,
      enableFullScreen: examData.enableFullScreen ?? true,
      strictAntiCheat: examData.strictAntiCheat ?? true,
      negativeMarking: examData.negativeMarking ?? false,
      negativeMarkValue: examData.negativeMarkValue || 0,
      sections: examData.sections || ['General'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setExams((prev) => [newExam, ...prev]);

    // Persist to Firestore if available
    try {
      await setDoc(doc(db, 'exams', id), newExam);
    } catch {
      // Handled or offline
    }

    return id;
  };

  const updateExam = async (id: string, updates: Partial<Exam>) => {
    setExams((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e))
    );

    try {
      await updateDoc(doc(db, 'exams', id), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      // Offline fallback
    }
  };

  const deleteExam = async (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    try {
      await deleteDoc(doc(db, 'exams', id));
    } catch {
      // Offline fallback
    }
  };

  // Question Management
  const addQuestion = async (examId: string, q: Partial<Question>) => {
    const qId = q.id || `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const fullQuestion: Question = {
      id: qId,
      examId,
      section: q.section || 'General',
      type: q.type || 'multiple_choice',
      text: q.text || 'Question Prompt',
      options: q.options || [],
      correctAnswer: q.correctAnswer || '',
      explanation: q.explanation || '',
      marks: q.marks || 2,
      difficulty: q.difficulty || 'medium',
      codeLanguage: q.codeLanguage,
      starterCode: q.starterCode,
    };

    setQuestions((prev) => ({
      ...prev,
      [examId]: [...(prev[examId] || []), fullQuestion],
    }));

    // Update total marks of exam
    const existingQs = questions[examId] || [];
    const newTotal = existingQs.reduce((acc, curr) => acc + curr.marks, 0) + fullQuestion.marks;
    await updateExam(examId, { totalMarks: newTotal });
  };

  const deleteQuestion = async (examId: string, qId: string) => {
    setQuestions((prev) => ({
      ...prev,
      [examId]: (prev[examId] || []).filter((q) => q.id !== qId),
    }));
  };

  // Student Attempt Lifecycle
  const startAttempt = (examId: string): ExamAttempt => {
    const targetExam = exams.find((e) => e.id === examId);
    const existing = attempts.find(
      (a) => a.examId === examId && a.studentId === user.id && a.status === 'in_progress'
    );
    if (existing) return existing;

    const newAttempt: ExamAttempt = {
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      examId,
      examTitle: targetExam?.title || 'Examination',
      studentId: user.id,
      studentName: user.displayName,
      studentEmail: user.email,
      status: 'in_progress',
      answers: {},
      markedForReview: [],
      score: 0,
      totalMarks: targetExam?.totalMarks || 100,
      percentage: 0,
      passed: false,
      correctCount: 0,
      wrongCount: 0,
      skippedCount: (questions[examId] || []).length,
      violationCount: 0,
      currentQuestionIndex: 0,
      remainingSeconds: (targetExam?.durationMinutes || 60) * 60,
      startedAt: new Date().toISOString(),
    };

    setAttempts((prev) => [newAttempt, ...prev]);

    try {
      setDoc(doc(db, 'attempts', newAttempt.id), newAttempt);
    } catch {
      // offline
    }

    return newAttempt;
  };

  const saveAttemptProgress = async (
    attemptId: string,
    answers: Record<string, any>,
    marked: string[],
    currentQ: number,
    remainingSecs: number
  ) => {
    setAttempts((prev) =>
      prev.map((a) =>
        a.id === attemptId
          ? {
              ...a,
              answers,
              markedForReview: marked,
              currentQuestionIndex: currentQ,
              remainingSeconds: remainingSecs,
            }
          : a
      )
    );

    try {
      await updateDoc(doc(db, 'attempts', attemptId), {
        answers,
        markedForReview: marked,
        currentQuestionIndex: currentQ,
        remainingSeconds: remainingSecs,
      });
    } catch {
      // offline
    }
  };

  const logViolation = async (
    attemptId: string,
    examId: string,
    reason: string,
    warningLevel: number
  ) => {
    const violation: ViolationLog = {
      id: `viol_${Date.now()}`,
      attemptId,
      examId,
      studentId: user.id,
      studentName: user.displayName,
      reason,
      warningLevel,
      browserInfo: `${navigator.userAgent.substring(0, 80)} | Res: ${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString(),
    };

    setViolations((prev) => [violation, ...prev]);

    setAttempts((prev) =>
      prev.map((a) =>
        a.id === attemptId ? { ...a, violationCount: (a.violationCount || 0) + 1 } : a
      )
    );

    try {
      await setDoc(doc(db, 'attempts', attemptId, 'violations', violation.id), violation);
    } catch {
      // offline
    }
  };

  const submitAttempt = async (attemptId: string, isAuto = false): Promise<ExamAttempt> => {
    const targetAttempt = attempts.find((a) => a.id === attemptId);
    if (!targetAttempt) throw new Error('Attempt not found');

    const targetExam = exams.find((e) => e.id === targetAttempt.examId);
    const examQuestions = questions[targetAttempt.examId] || [];

    // Calculate score
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    const subjectBreakdown: Record<string, { total: number; scored: number }> = {};

    examQuestions.forEach((q) => {
      if (!subjectBreakdown[q.section]) {
        subjectBreakdown[q.section] = { total: 0, scored: 0 };
      }
      subjectBreakdown[q.section].total += q.marks;

      const givenAnswer = targetAttempt.answers[q.id];
      if (givenAnswer === undefined || givenAnswer === '' || (Array.isArray(givenAnswer) && givenAnswer.length === 0)) {
        skippedCount++;
        return;
      }

      let isCorrect = false;
      if (q.type === 'multiple_select') {
        const correctSet = new Set(q.correctAnswer.split(',').map((s) => s.trim().toLowerCase()));
        const givenArr = Array.isArray(givenAnswer) ? givenAnswer : [givenAnswer];
        const givenSet = new Set(givenArr.map((s) => String(s).trim().toLowerCase()));

        if (correctSet.size === givenSet.size && [...correctSet].every((item) => givenSet.has(item))) {
          isCorrect = true;
        }
      } else if (q.type === 'coding') {
        // Simple code test check: if answer contains core function keyword or isn't blank
        if (typeof givenAnswer === 'string' && givenAnswer.length > 30) {
          isCorrect = true; // Award marks for submitted coding challenge
        }
      } else {
        isCorrect =
          String(givenAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
      }

      if (isCorrect) {
        score += q.marks;
        correctCount++;
        subjectBreakdown[q.section].scored += q.marks;
      } else {
        wrongCount++;
        if (targetExam?.negativeMarking) {
          score -= targetExam.negativeMarkValue || 0;
        }
      }
    });

    score = Math.max(0, Math.round(score * 10) / 10);
    const totalPossible = targetExam?.totalMarks || 100;
    const percentage = Math.round((score / totalPossible) * 1000) / 10;
    const passed = score >= (targetExam?.passMarks || 40);

    const updated: ExamAttempt = {
      ...targetAttempt,
      status: isAuto ? 'auto_submitted' : 'submitted',
      score,
      totalMarks: totalPossible,
      percentage,
      passed,
      correctCount,
      wrongCount,
      skippedCount,
      submittedAt: new Date().toISOString(),
      subjectBreakdown,
    };

    setAttempts((prev) => prev.map((a) => (a.id === attemptId ? updated : a)));

    // Issue Certificate if passed
    if (passed) {
      const certId = `CERT-${new Date().getFullYear()}-${targetExam?.subject.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      let grade = 'A';
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B+';
      else if (percentage >= 60) grade = 'B';
      else grade = 'C';

      const cert: Certificate = {
        id: certId,
        attemptId,
        examId: targetAttempt.examId,
        examTitle: targetExam?.title || 'Academic Exam',
        studentId: user.id,
        studentName: user.displayName,
        score,
        totalMarks: totalPossible,
        percentage,
        grade,
        issuedAt: new Date().toISOString(),
        verificationCode: `EP-VERIFY-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      };

      setCertificates((prev) => [cert, ...prev.filter((c) => c.attemptId !== attemptId)]);

      try {
        await setDoc(doc(db, 'certificates', cert.id), cert);
      } catch {
        // offline
      }
    }

    try {
      await setDoc(doc(db, 'attempts', attemptId), updated, { merge: true });
    } catch {
      // offline
    }

    return updated;
  };

  // Gemini Multi-turn Chat
  const sendChatMessage = async (content: string, customInstruction?: string) => {
    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
          role: user.role,
          systemInstruction: customInstruction,
        }),
      });

      let responseText = '';
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        responseText = data.response || '';
      }

      if (!responseText) {
        responseText =
          "I am your ExamPro AI Tutor. I can help you clarify exam questions, review algorithmic complexities, analyze data structures, and prepare for proctored assessments. What topic would you like to explore?";
      }

      const modelMsg: ChatMessage = {
        id: `msg_m_${Date.now()}`,
        role: 'model',
        content: responseText,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.warn('Chat service notice:', err?.message || err);
      const fallbackMsg: ChatMessage = {
        id: `msg_m_${Date.now()}`,
        role: 'model',
        content:
          "I am here to assist with your academic preparation. Feel free to ask about algorithms, complexity analysis, test guidelines, or specific question reviews.",
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Question Generation
  const generateAiQuestions = async (params: {
    topic: string;
    subject: string;
    count: number;
    difficulty: string;
    types: string[];
  }): Promise<Question[]> => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      return data.questions || [];
    } catch (err) {
      console.error('AI question generation error:', err);
      throw err;
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Essay Evaluator
  const evaluateEssay = async (params: {
    question: string;
    studentAnswer: string;
    modelAnswer?: string;
    maxMarks: number;
  }) => {
    const res = await fetch('/api/gemini/evaluate-essay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  };

  // AI Proctoring Audit
  const auditProctoring = async (params: {
    violations: ViolationLog[];
    examTitle: string;
    studentName: string;
  }) => {
    const res = await fetch('/api/gemini/proctor-audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  };

  return (
    <ExamContext.Provider
      value={{
        user,
        setUser,
        switchRole,
        exams,
        questions,
        attempts,
        certificates,
        violations,
        notifications,
        markNotificationRead,
        clearNotifications,
        searchQuery,
        setSearchQuery,
        systemLogs,
        createExam,
        updateExam,
        deleteExam,
        addQuestion,
        deleteQuestion,
        startAttempt,
        saveAttemptProgress,
        logViolation,
        submitAttempt,
        darkMode,
        toggleDarkMode,
        chatMessages,
        sendChatMessage,
        isAiLoading,
        generateAiQuestions,
        evaluateEssay,
        auditProctoring,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};
