export const dictionary = {
  pt: {
    nav: { hero: "Início", about: "O que faço", exp: "Experiência", projects: "Projetos", stack: "Stack", contact: "Contato" },
    hero: { greeting: "Olá, eu sou", role: "Desenvolvedor de Software", desc: "Focado em transformar teoria em código, com forte interesse em fundamentos da computação e lógica.", cv: "Baixar CV" },
    projects: { title: "Projetos Recentes", view: "Ver Projeto" },
    projectsData: [
      { title: "Conversor NFA para AFNG", desc: "Ferramenta para converter Autômatos Finitos Não Determinísticos com transições epsilon para Autômatos Finitos Não Determinísticos Generalizados para derivar expressões regulares.", img: "/images/project1.png" },
      { title: "Visualizador de Árvore Sintática", desc: "Aplicação interativa para estudo de Gramáticas Livres de Contexto (CFG) e renderização de árvores sintáticas.", img: "/images/project2.png" }
    ],
    experience: { title: "Experiência Profissional" },
    expData: [
      { role: "Desenvolvedor Full Stack", company: "Tech Corp", time: "2023 - Presente", desc: "Desenvolvimento de aplicações escaláveis utilizando Next.js e microsserviços." }
    ],
    stack: { title: "Stack de Tecnologias" },
    contact: { title: "Entre em Contato", name: "Nome", email: "Email", msg: "Mensagem", send: "Enviar Mensagem", success: "Mensagem enviada com sucesso!" },
    sidebar: { listening: "Ouvindo agora", artist: "Jon Bellion" }
  },
  en: {
    nav: { hero: "Home", about: "What I Do", exp: "Experience", projects: "Projects", stack: "Stack", contact: "Contact" },
    hero: { greeting: "Hi, I am", role: "Software Developer", desc: "Focused on turning theory into code, with a strong interest in computing fundamentals and logic.", cv: "Download CV" },
    projects: { title: "Recent Projects", view: "View Project" },
    projectsData: [
      { title: "NFA to AFNG Converter", desc: "Tool to convert Nondeterministic Finite Automata with epsilon transitions into Generalized Nondeterministic Finite Automata to derive regular expressions.", img: "/images/project1.png" },
      { title: "Syntax Tree Visualizer", desc: "Interactive application for studying Context-Free Grammars (CFG) and rendering syntax trees.", img: "/images/project2.png" }
    ],
    experience: { title: "Professional Experience" },
    expData: [
      { role: "Full Stack Developer", company: "Tech Corp", time: "2023 - Present", desc: "Development of scalable applications using Next.js and microservices." }
    ],
    stack: { title: "Tech Stack" },
    contact: { title: "Get in Touch", name: "Name", email: "Email", msg: "Message", send: "Send Message", success: "Message sent successfully!" },
    sidebar: { listening: "Now Listening", artist: "Jon Bellion" }
  }
};

export type Lang = 'pt' | 'en';