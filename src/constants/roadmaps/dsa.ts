export const dsaRoadmap = {
  slug: "dsa",
  title: "DSA Mastery Roadmap",
  description:
    "A structured roadmap to master Data Structures and Algorithms for coding interviews and competitive programming. The journey starts with choosing a programming language, learning DSA fundamentals using Striver’s A2Z Sheet, and then progressively solving LeetCode problems from easy to hard while participating in contests and practicing problem of the day.",
  duration: "6-12 months",

  nodes: [
    {
      id: "1",
      position: { x: 0, y: 0 },
      data: {
        title: "Choose a Programming Language",
        description:
          "Pick one programming language for DSA such as C++, Java, or Python. Focus on mastering its syntax and STL or standard libraries.",
        link: "https://cplusplus.com/reference/"
      }
    },

    {
      id: "2",
      position: { x: 0, y: 120 },
      data: {
        title: "Complete Striver A2Z DSA Sheet (Basics)",
        description:
          "Start learning the fundamentals of DSA using Striver’s A2Z Sheet. Focus on arrays, strings, recursion, sorting, and basic problem-solving.",
        link: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/"
      }
    },

    {
      id: "3",
      position: { x: 0, y: 240 },
      data: {
        title: "Learn Advanced DSA Concepts",
        description:
          "Move towards advanced topics like trees, graphs, dynamic programming, greedy algorithms, and advanced data structures.",
        link: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/"
      }
    },

    {
      id: "4",
      position: { x: 0, y: 360 },
      data: {
        title: "Start Pattern-Based LeetCode Practice",
        description:
          "Solve LeetCode problems based on the patterns you are learning in DSA such as sliding window, two pointers, recursion, and dynamic programming.",
        link: "https://leetcode.com/problemset/"
      }
    },

    {
      id: "5",
      position: { x: -250, y: 480 },
      data: {
        title: "Solve LeetCode Easy (1–2 Months)",
        description:
          "For the first 1–2 months focus primarily on easy problems to build problem-solving intuition and strengthen basic concepts.",
        link: "https://leetcode.com/problemset/"
      }
    },

    {
      id: "6",
      position: { x: 0, y: 600 },
      data: {
        title: "Solve Easy + Medium Problems",
        description:
          "Gradually move towards solving both easy and medium problems regularly. Focus on understanding patterns and improving coding speed.",
        link: "https://leetcode.com/problemset/"
      }
    },

   {
  id: "7",
  position: { x: 0, y: 720 },
  data: {
    title: "Medium + Hard Problems",
    description:
      "Once comfortable with medium problems, begin solving harder problems to strengthen algorithmic thinking.",
    link: "https://leetcode.com/problemset/"
  }
   },

{
  id: "8",
  position: { x: 0, y: 840 },
  data: {
    title: "Solve Problem of the Day (POTD)",
    description:
      "Solve LeetCode Problem of the Day regularly to maintain consistency. If you struggle with the solution, refer to explanations from the YouTube channel CodeStoryWithMIK for detailed intuition and optimized approaches.",
    link: "https://www.youtube.com/@codestorywithMIK"
  }
} ,

{
  id: "9",
  position: { x: 0, y: 840 },
  data: {
    title: "Start Virtual Contests",
    description:
      "Practice by participating in virtual contests. This helps simulate real contest pressure and improves speed and problem-solving accuracy.",
    link: "https://leetcode.com/contest/"
  }
},

{
  id: "10",
  position: { x: 0, y: 960 },
  data: {
    title: "Participate in Real Contests",
    description:
      "Once comfortable with medium-hard questions, start appearing in real contests and carefully analyze the questions afterward.",
    link: "https://leetcode.com/contest/"
  }
},

{
  id: "11",
  position: { x: 0, y: 1080 },
  data: {
    title: "Follow the 20 Minute Rule",
    description:
      "If you cannot solve a problem within 20 minutes, review the editorial or solution. Always think about possible approaches first to train your problem-solving mindset.",
    link: "https://leetcode.com/problemset/"
  }
}
  ],

 edges: [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e3-4", source: "3", target: "4" },
  { id: "e4-5", source: "4", target: "5" },
  { id: "e5-6", source: "5", target: "6" },
  { id: "e6-7", source: "6", target: "7" },
  { id: "e7-8", source: "7", target: "8" },
  { id: "e8-9", source: "8", target: "9" },
  { id: "e9-10", source: "9", target: "10" },
  { id: "e10-11", source: "10", target: "11" }
]
};