/**
 * Custom Course Hub Configuration & Icon Maps
 */

window.CourseHubConfig = {
  appName: "Custom Course Hub",
  institution: "MIT AOE",
  defaultSemester: "SEM-IV",
  defaultAcademicYear: "2025-26",
  moodleBaseUrl: "https://moodle.mitaoe.ac.in",
  dataUrl: "data/courses.json",

  // Embedded default fallback dataset
  defaultCourses: [
    {
      id: "dbms-a",
      code: "ET2101",
      title: "Database Management System-A",
      semester: "SEM-IV",
      academicYear: "2025-26",
      type: "Theory + Lab",
      theme: "indigo",
      icon: "database",
      instructor: "Dept. of Computer Engineering",
      description: "Relational database concepts, SQL queries, normalization, transaction management, and indexing.",
      links: [
        {
          name: "Theory",
          url: "https://moodle.mitaoe.ac.in/course/view.php?id=5909",
          badge: "Lecture",
          type: "theory"
        },
        {
          name: "Lab",
          url: "https://moodle.mitaoe.ac.in/course/view.php?id=5910",
          badge: "Practical",
          type: "lab"
        }
      ],
      isFavorite: true
    },
    {
      id: "oop-java",
      code: "CS202",
      title: "Object Oriented Programming (Core Java)",
      semester: "SEM-IV",
      academicYear: "2025-26",
      type: "Lab",
      theme: "emerald",
      icon: "code",
      instructor: "Dept. of Computer Engineering",
      description: "Hands-on object-oriented programming in Java: classes, inheritance, polymorphism, streams, and exception handling.",
      links: [
        {
          name: "Lab",
          url: "https://moodle.mitaoe.ac.in/course/view.php?id=5915",
          badge: "Practical",
          type: "lab"
        }
      ],
      isFavorite: true
    },
    {
      id: "ads",
      code: "CS203",
      title: "Advanced Data Structures",
      semester: "SEM-IV",
      academicYear: "2025-26",
      type: "Theory + Lab",
      theme: "purple",
      icon: "layers",
      instructor: "Dept. of Computer Engineering",
      description: "Advanced trees (AVL, Red-Black, B-Trees), graphs, dynamic programming, and algorithm optimization.",
      links: [
        {
          name: "Theory",
          url: "https://moodle.mitaoe.ac.in/course/view.php?id=5912",
          badge: "Lecture",
          type: "theory"
        },
        {
          name: "Lab",
          url: "https://moodle.mitaoe.ac.in/course/view.php?id=5913",
          badge: "Practical",
          type: "lab"
        }
      ],
      isFavorite: true
    },
    {
      id: "eng-informatics",
      code: "ET2103",
      title: "Engineering Informatics",
      semester: "SEM-IV",
      academicYear: "2025-26",
      type: "Theory + Lab",
      theme: "amber",
      icon: "cpu",
      instructor: "Dept. of Computer Engineering",
      description: "Data analytics, computational intelligence, signal fundamentals, and engineering software tools.",
      links: [
        {
          name: "Theory",
          url: "https://moodle.mitaoe.ac.in/course/view.php?id=5907",
          badge: "Lecture",
          type: "theory"
        },
        {
          name: "Lab",
          url: "https://moodle.mitaoe.ac.in/course/view.php?id=5908",
          badge: "Practical",
          type: "lab"
        }
      ],
      isFavorite: false
    },
    {
      id: "toc",
      code: "CS204",
      title: "Theory of Computation",
      semester: "SEM-IV",
      academicYear: "2025-26",
      type: "Theory",
      theme: "cyan",
      icon: "activity",
      instructor: "Dept. of Computer Engineering",
      description: "Finite automata, regular expressions, context-free grammars, Turing machines, and computability theory.",
      links: [
        {
          name: "Theory",
          url: "https://moodle.mitaoe.ac.in/course/view.php?id=5918",
          badge: "Lecture",
          type: "theory"
        }
      ],
      isFavorite: false
    },
    {
      id: "sy-project",
      code: "PR201",
      title: "Second Year Capstone Project",
      semester: "SEM-IV",
      academicYear: "2025-26",
      type: "Project",
      theme: "rose",
      icon: "sparkles",
      instructor: "Project Review Committee",
      description: "Team project applying engineering principles to real-world software and hardware problem statements.",
      links: [
        {
          name: "Project Portal",
          url: "https://moodle.mitaoe.ac.in/course/view.php?id=5920",
          badge: "Submissions",
          type: "project"
        }
      ],
      isFavorite: false
    },
    {
      id: "cis",
      code: "JSL26-27",
      title: "Cryptography and Information Security",
      semester: "SEM-V",
      academicYear: "2026-27",
      type: "Elective",
      theme: "purple",
      icon: "activity",
      instructor: "Dept. of Computer Engineering",
      description: "Cryptographic algorithms, network security, authentication protocols, and information security principles.",
      links: [
        {
          name: "Course Portal",
          url: "https://moodle.mitaoe.ac.in/course/view.php?id=5920",
          badge: "Elective",
          type: "elective"
        }
      ],
      isFavorite: false
    }
  ],

  // Feather / Lucide styled SVG icons
  icons: {
    database: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
    code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
    cpu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`,
    activity: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
    sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    bookOpen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
    flask: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31L4.12 19A2 2 0 0 0 5.86 22h12.28a2 2 0 0 0 1.74-3L14 9.31V2"></path><line x1="8.5" y1="2" x2="15.5" y2="2"></line><line x1="7" y1="14" x2="17" y2="14"></line></svg>`,
    externalLink: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    starFilled: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    codeEmbed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
    grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
    list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
    copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`
  }
};
