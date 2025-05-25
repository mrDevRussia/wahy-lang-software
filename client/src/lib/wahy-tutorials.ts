/**
 * نظام الدروس التعليمية التفاعلية للغة وحي
 * Interactive Tutorials System for Wahy Language
 */

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  code: string;
  expectedOutput?: string;
  hints: string[];
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  concepts: string[];
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  category: 'html' | 'css' | 'javascript' | 'mixed';
  steps: TutorialStep[];
  prerequisites: string[];
  learningObjectives: string[];
}

export class WahyTutorials {
  private tutorials: Map<string, Tutorial> = new Map();

  constructor() {
    this.initializeTutorials();
  }

  private initializeTutorials() {
    // الدرس الأول: أساسيات HTML
    this.addTutorial({
      id: 'html-basics',
      title: 'أساسيات إنشاء صفحات الويب',
      description: 'تعلم كيفية إنشاء صفحة ويب بسيطة باستخدام لغة وحي',
      duration: '15 دقيقة',
      difficulty: 'مبتدئ',
      category: 'html',
      prerequisites: [],
      learningObjectives: [
        'إنشاء صفحة HTML أساسية',
        'إضافة عناوين وفقرات',
        'إدراج الصور والروابط',
        'تنظيم المحتوى في قوائم'
      ],
      steps: [
        {
          id: 'step-1',
          title: 'إنشاء صفحة جديدة',
          description: 'لنبدأ بإنشاء صفحة ويب جديدة. كل صفحة في لغة وحي تبدأ بالأمر "افتح صفحة".',
          code: 'افتح صفحة "صفحتي الأولى"',
          hints: [
            'تأكد من وضع عنوان الصفحة بين علامتي تنصيص',
            'العنوان سيظهر في شريط المتصفح'
          ],
          difficulty: 'مبتدئ',
          concepts: ['إنشاء صفحة', 'العناوين']
        },
        {
          id: 'step-2',
          title: 'إضافة عنوان رئيسي',
          description: 'الآن سنضيف عنواناً رئيسياً لصفحتنا باستخدام الأمر "أضف عنوان".',
          code: `افتح صفحة "صفحتي الأولى"
أضف عنوان "مرحباً بكم في موقعي"`,
          hints: [
            'العنوان الرئيسي يظهر بخط كبير وعريض',
            'يمكنك استخدام أي نص تريده'
          ],
          difficulty: 'مبتدئ',
          concepts: ['العناوين الرئيسية']
        },
        {
          id: 'step-3',
          title: 'إضافة فقرة نصية',
          description: 'لنضيف بعض النص التوضيحي باستخدام الأمر "أضف فقرة".',
          code: `افتح صفحة "صفحتي الأولى"
أضف عنوان "مرحباً بكم في موقعي"
أضف فقرة "هذا هو موقعي الشخصي حيث أشارككم أفكاري وتجاربي"`,
          hints: [
            'الفقرات تستخدم لعرض النصوص الطويلة',
            'يمكنك إضافة عدة فقرات في الصفحة الواحدة'
          ],
          difficulty: 'مبتدئ',
          concepts: ['الفقرات', 'النصوص']
        },
        {
          id: 'step-4',
          title: 'إضافة رابط',
          description: 'سنضيف رابطاً يوجه الزوار لموقع آخر.',
          code: `افتح صفحة "صفحتي الأولى"
أضف عنوان "مرحباً بكم في موقعي"
أضف فقرة "هذا هو موقعي الشخصي حيث أشارككم أفكاري وتجاربي"
أضف رابط "زوروا موقع جوجل" "https://google.com"`,
          hints: [
            'الرابط يحتاج لنصين: النص الظاهر والعنوان المراد الانتقال إليه',
            'تأكد من كتابة العنوان كاملاً مع http أو https'
          ],
          difficulty: 'مبتدئ',
          concepts: ['الروابط', 'التنقل']
        },
        {
          id: 'step-5',
          title: 'إغلاق الصفحة',
          description: 'أخيراً، يجب إغلاق الصفحة باستخدام الأمر "أغلق صفحة".',
          code: `افتح صفحة "صفحتي الأولى"
أضف عنوان "مرحباً بكم في موقعي"
أضف فقرة "هذا هو موقعي الشخصي حيث أشارككم أفكاري وتجاربي"
أضف رابط "زوروا موقع جوجل" "https://google.com"
أغلق صفحة`,
          hints: [
            'إغلاق الصفحة ضروري لإنهاء الكود بشكل صحيح',
            'بدون إغلاق الصفحة قد لا تعمل الصفحة بشكل سليم'
          ],
          difficulty: 'مبتدئ',
          concepts: ['إغلاق الصفحة', 'بنية الكود']
        }
      ]
    });

    // الدرس الثاني: التصميم بـ CSS
    this.addTutorial({
      id: 'css-styling',
      title: 'تصميم وتنسيق الصفحات',
      description: 'تعلم كيفية تصميم صفحاتك بألوان وخطوط جميلة',
      duration: '20 دقيقة',
      difficulty: 'متوسط',
      category: 'css',
      prerequisites: ['html-basics'],
      learningObjectives: [
        'تغيير ألوان الصفحة',
        'تنسيق الخطوط',
        'إضافة أنماط متقدمة',
        'تنسيق العناصر'
      ],
      steps: [
        {
          id: 'css-step-1',
          title: 'تغيير لون الخلفية',
          description: 'لنبدأ بتغيير لون خلفية صفحتنا لجعلها أكثر جاذبية.',
          code: `ابدأ_CSS
اختر body
لون_الخلفية lightblue
أنهِ_CSS

افتح صفحة "صفحة ملونة"
أضف عنوان "مرحباً بالتصميم الجميل"
أغلق صفحة`,
          hints: [
            'استخدم ابدأ_CSS لبدء قسم التصميم',
            'body يشير إلى الصفحة كاملة',
            'يمكنك استخدام أسماء الألوان الإنجليزية'
          ],
          difficulty: 'متوسط',
          concepts: ['CSS', 'ألوان الخلفية', 'اختيار العناصر']
        },
        {
          id: 'css-step-2',
          title: 'تنسيق الخطوط',
          description: 'سنغير نوع الخط وحجمه لجعل النص أكثر وضوحاً.',
          code: `ابدأ_CSS
اختر body
لون_الخلفية lightblue
الخط Arial
حجم_الخط 18px
أنهِ_CSS

افتح صفحة "صفحة منسقة"
أضف عنوان "عنوان بخط جميل"
أضف فقرة "هذا النص منسق بخط وحجم مناسب"
أغلق صفحة`,
          hints: [
            'حجم الخط يُكتب بوحدة px (بكسل)',
            'يمكنك تجربة خطوط مختلفة مثل Times أو Helvetica'
          ],
          difficulty: 'متوسط',
          concepts: ['أنواع الخطوط', 'أحجام الخطوط']
        }
      ]
    });

    // الدرس الثالث: البرمجة التفاعلية
    this.addTutorial({
      id: 'interactive-programming',
      title: 'إنشاء صفحات تفاعلية',
      description: 'تعلم كيفية إضافة الأزرار والتفاعل مع المستخدم',
      duration: '25 دقيقة',
      difficulty: 'متقدم',
      category: 'javascript',
      prerequisites: ['html-basics', 'css-styling'],
      learningObjectives: [
        'إنشاء أزرار تفاعلية',
        'التعامل مع الأحداث',
        'إظهار الرسائل',
        'تغيير المحتوى ديناميكياً'
      ],
      steps: [
        {
          id: 'js-step-1',
          title: 'إنشاء زر تفاعلي',
          description: 'سننشئ زراً يظهر رسالة عند الضغط عليه.',
          code: `افتح صفحة "صفحة تفاعلية"
أضف عنوان "تعلم التفاعل"

ابدأ_JS
دالة ترحيب() {
  أظهر_رسالة "مرحباً بك في عالم البرمجة!"
}
أنهِ_JS

أنشئ_زر "اضغط للترحيب" "ترحيب()"
أغلق صفحة`,
          hints: [
            'الدالة تحتوي على الكود الذي سيتم تنفيذه',
            'اسم الدالة يجب أن يكون نفسه في الزر',
            'أظهر_رسالة يعرض نافذة منبثقة'
          ],
          difficulty: 'متقدم',
          concepts: ['الدوال', 'الأحداث', 'الرسائل']
        }
      ]
    });

    // الدرس الرابع: مشروع متكامل
    this.addTutorial({
      id: 'complete-project',
      title: 'بناء موقع شخصي متكامل',
      description: 'مشروع شامل يجمع كل ما تعلمته في موقع شخصي جميل',
      duration: '45 دقيقة',
      difficulty: 'متقدم',
      category: 'mixed',
      prerequisites: ['html-basics', 'css-styling', 'interactive-programming'],
      learningObjectives: [
        'دمج HTML وCSS وJavaScript',
        'إنشاء تصميم متجاوب',
        'إضافة تفاعلات متقدمة',
        'تنظيم الكود بشكل احترافي'
      ],
      steps: [
        {
          id: 'project-step-1',
          title: 'التخطيط للمشروع',
          description: 'سنبني موقعاً شخصياً يحتوي على معلومات عنك ومهاراتك.',
          code: `# مخطط الموقع الشخصي
# 1. رأس الصفحة مع الاسم
# 2. قسم "عني" 
# 3. قسم المهارات
# 4. قسم المشاريع
# 5. قسم التواصل

افتح صفحة "موقعي الشخصي"`,
          hints: [
            'التخطيط المسبق يوفر الوقت والجهد',
            'فكر في المحتوى قبل البدء بالكود'
          ],
          difficulty: 'متقدم',
          concepts: ['التخطيط', 'بنية المشروع']
        }
      ]
    });
  }

  private addTutorial(tutorial: Tutorial) {
    this.tutorials.set(tutorial.id, tutorial);
  }

  getAllTutorials(): Tutorial[] {
    return Array.from(this.tutorials.values());
  }

  getTutorial(id: string): Tutorial | undefined {
    return this.tutorials.get(id);
  }

  getTutorialsByDifficulty(difficulty: Tutorial['difficulty']): Tutorial[] {
    return this.getAllTutorials().filter(t => t.difficulty === difficulty);
  }

  getTutorialsByCategory(category: Tutorial['category']): Tutorial[] {
    return this.getAllTutorials().filter(t => t.category === category);
  }

  getRecommendedTutorials(completedTutorials: string[]): Tutorial[] {
    return this.getAllTutorials().filter(tutorial => {
      // إذا كان الدرس مكتملاً، لا نوصي به
      if (completedTutorials.includes(tutorial.id)) {
        return false;
      }

      // تحقق من توفر المتطلبات المسبقة
      const hasPrerequisites = tutorial.prerequisites.every(
        prereq => completedTutorials.includes(prereq)
      );

      return hasPrerequisites;
    });
  }

  searchTutorials(query: string): Tutorial[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllTutorials().filter(tutorial =>
      tutorial.title.includes(query) ||
      tutorial.description.includes(query) ||
      tutorial.title.toLowerCase().includes(lowercaseQuery) ||
      tutorial.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  // تقييم كود الطالب مقارنة بالمتوقع
  evaluateCode(stepId: string, userCode: string): {
    correct: boolean;
    feedback: string[];
    suggestions: string[];
  } {
    // هذه دالة بسيطة للتقييم، يمكن تطويرها أكثر
    const step = this.findStepById(stepId);
    if (!step) {
      return {
        correct: false,
        feedback: ['لم يتم العثور على الخطوة'],
        suggestions: []
      };
    }

    const userLines = userCode.trim().split('\n').map(line => line.trim());
    const expectedLines = step.code.trim().split('\n').map(line => line.trim());

    const feedback: string[] = [];
    const suggestions: string[] = [];
    let correct = true;

    // تحقق من الأوامر الأساسية
    if (step.concepts.includes('إنشاء صفحة') && !userCode.includes('افتح صفحة')) {
      correct = false;
      feedback.push('لم تستخدم الأمر "افتح صفحة" لإنشاء الصفحة');
      suggestions.push('أضف الأمر: افتح صفحة "عنوان صفحتك"');
    }

    if (step.concepts.includes('إغلاق الصفحة') && !userCode.includes('أغلق صفحة')) {
      correct = false;
      feedback.push('لم تستخدم الأمر "أغلق صفحة" لإنهاء الصفحة');
      suggestions.push('أضف الأمر: أغلق صفحة');
    }

    if (step.concepts.includes('العناوين الرئيسية') && !userCode.includes('أضف عنوان')) {
      correct = false;
      feedback.push('لم تضف عنواناً رئيسياً');
      suggestions.push('أضف الأمر: أضف عنوان "عنوانك هنا"');
    }

    if (correct && userLines.length === expectedLines.length) {
      feedback.push('ممتاز! كودك صحيح ومطابق للمطلوب');
    } else if (correct) {
      feedback.push('الكود يعمل بشكل صحيح ولكن قد يختلف قليلاً عن المثال');
    }

    return { correct, feedback, suggestions };
  }

  private findStepById(stepId: string): TutorialStep | undefined {
    for (const tutorial of this.tutorials.values()) {
      const step = tutorial.steps.find(s => s.id === stepId);
      if (step) return step;
    }
    return undefined;
  }

  // إنشاء مسار تعليمي مخصص
  generateLearningPath(userLevel: 'مبتدئ' | 'متوسط' | 'متقدم'): Tutorial[] {
    const allTutorials = this.getAllTutorials();
    
    if (userLevel === 'مبتدئ') {
      return allTutorials.filter(t => t.difficulty === 'مبتدئ').slice(0, 3);
    } else if (userLevel === 'متوسط') {
      return allTutorials.filter(t => 
        t.difficulty === 'مبتدئ' || t.difficulty === 'متوسط'
      );
    } else {
      return allTutorials;
    }
  }

  // إحصائيات التقدم
  calculateProgress(completedSteps: string[], tutorialId: string): {
    completedSteps: number;
    totalSteps: number;
    percentage: number;
  } {
    const tutorial = this.getTutorial(tutorialId);
    if (!tutorial) {
      return { completedSteps: 0, totalSteps: 0, percentage: 0 };
    }

    const tutorialSteps = tutorial.steps.map(s => s.id);
    const completed = completedSteps.filter(stepId => 
      tutorialSteps.includes(stepId)
    ).length;

    return {
      completedSteps: completed,
      totalSteps: tutorial.steps.length,
      percentage: Math.round((completed / tutorial.steps.length) * 100)
    };
  }
}