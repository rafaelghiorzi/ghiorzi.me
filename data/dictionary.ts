export const dictionary = {
    pt: {
        nav: {
            name: "Rafael Ghiorzi",
            role: "Infraestrutura & Backend",
            hero: "Início",
            exp: "Experiência",
            projects: "Projetos",
            contact: "Contato",
        },

        hero: {
            title: "Construindo sistemas para o mundo real",
            desc: "Estudante de Ciência da Computação focado em automação, observabilidade e infraestrutura, com base sólida em desenvolvimento backend.",
        },

        introduction: {
            title: "Olá! Eu sou Rafael Ghiorzi",
            desc: "Estudo Ciência da Computação na Universidade de Brasília, com grande interesse em infraestrutura, observabilidade e desenvolvimento backend. Gosto de entender como os sistemas se comportam em cenários reais, do desenvolvimento à produção. Mantenho um homelab para experimentar com containers, automação e monitoramento, e publiquei um pacote Python no PyPI. No meu tempo livre, amo ouvir e fazer música. Sou baterista há anos e acredito que aprender um instrumento é a melhor forma de desenvolver disciplina, criatividade e consistência, características que trago naturalmente para o meu trabalho como desenvolvedor.",
        },

        projects: {
            title: "Alguns projetos que eu já participei",
            desc: "Alguns dos projetos que desenvolvi e venho explorando.",
        },

        projectsData: [
            {
                title: "PdfPlucker",
                desc: "Pacote Python publicado no PyPI para extração estruturada de texto, tabelas e imagens de PDFs em lote. Processou centenas de livros em pesquisas internas, substituindo ferramentas pagas, com execução paralela e aceleração por GPU.",
                tech: "Python, PyPI, Docling, CLI",
                img: "/plucker.png",
                link: "https://github.com/rafaelghiorzi/pdfplucker",
            },
            {
                title: "Homelab Cookbook",
                desc: "Laboratório de infraestrutura validado em máquinas virtuais: Proxmox, deploy de serviços em K3s com auto-scaling, provisionamento via Ansible e stack de observabilidade LGTM (Loki, Grafana, Tempo, Prometheus).",
                tech: "Proxmox, K3s, Ansible, Grafana",
                img: "",
                link: "https://github.com/rafaelghiorzi/homelab-infra",
            },
            {
                title: "Extração de Nomes – DOE São Paulo",
                desc: "Pipeline híbrido para extrair dados estruturados de documentos históricos (1982–2001), combinando detecção de layout (YOLO), OCR (Document AI) e LLMs. Atingiu 75% de recall na extração de nomes, superando OCR tradicional.",
                tech: "Python, YOLO, Document AI, LLMs",
                img: "",
                link: "",
            },
            {
                title: "RAG Publications",
                desc: "Sistema RAG multimodal e multiagente para consulta a um repositório de conhecimento. Indexou cerca de 1.200 documentos com latência de ~200ms na busca, com deploy em Docker.",
                tech: "Python, FastAPI, Qdrant, Docker",
                img: "/ipeapub.png",
                link: "https://github.com/rafaelghiorzi/IpeaPub",
            },
            {
                title: "Sistema de Gestão de Membros (FGM)",
                desc: "Sistema full-stack de gestão de membros e projetos de uma empresa júnior, usado por mais de 150 membros. Atuei como desenvolvedor e gerente do projeto, com API REST documentada, testes e CI/CD.",
                tech: "Next.js, NestJS, PostgreSQL",
                img: "",
                link: "",
            },
            {
                title: "Seu Caminho",
                desc: "Plataforma social de rotas em rodovias, vencedora (1º lugar) do Hackathon de Inovação da ABCR 2026. Gera rotas personalizadas, compara trajetos entre usuários e identifica as concessionárias responsáveis. Construí o software completo.",
                tech: "Plataforma Web, Geolocalização, Rotas",
                img: "",
                link: "",
            },
        ],

        experience: {
            title: "Experiência",
            desc: "Por onde eu já passei.",
        },

        expData: [
            {
                role: "Pesquisador de Iniciação Científica (PIBIC)",
                company: "Universidade de Brasília — Redes Baseadas em Intenção",
                time: "Jun. 2026 - Atual",
                desc: "Pesquisa em Redes Baseadas em Intenção (IBN). Desenvolvo um coletor de telemetria adaptativo em formato OpenTelemetry, que ajusta dinamicamente o que coleta conforme as intenções instaladas na rede, usando machine learning para reduzir a sobrecarga de monitoramento.",
                tech: "OpenTelemetry, Observabilidade, Machine Learning, Redes",
            },
            {
                role: "Pesquisador em Ciência de Dados",
                company:
                    "Instituto de Pesquisa Econômica Aplicada (IpeaData-Lab)",
                time: "Fev. 2025 - Dez. 2025",
                desc: "Desenvolvimento de pipelines de dados e sistemas de IA. Construí um sistema RAG que indexou ~1.200 documentos com latência de ~200ms e publiquei o PdfPlucker no PyPI, substituindo ferramentas pagas. Deploy em Docker na infraestrutura interna.",
                tech: "Python, FastAPI, Qdrant, Docker",
            },
            {
                role: "Desenvolvedor de Software & Líder de Projeto",
                company: "Empresa Júnior de Computação – CJR",
                time: "Out. 2023 - Fev. 2025",
                desc: "Desenvolvi e liderei o FGM, sistema full-stack de gestão usado por mais de 150 membros, com API REST documentada, testes unitários e CI/CD via GitHub Actions. Atuei com Scrum/Kanban em sprints quinzenais.",
                tech: "Next.js, NestJS, Prisma, CI/CD",
            },
        ],

        contact: {
            title: "Contato",
            desc: "Fique à vontade para entrar em contato!",
            github: "https://github.com/rafaelghiorzi",
            linkedin: "https://linkedin.com/in/rafaeldghiorzi",
            cv: "https://looking.cv/rafaeldghiorzi",
        },

        copyright: "© 2026 Rafael Ghiorzi. Todos os direitos reservados",
    },
    en: {
        nav: {
            name: "Rafael Ghiorzi",
            role: "Infrastructure & Backend",
            hero: "Home",
            exp: "Experience",
            projects: "Projects",
            contact: "Contact",
        },

        hero: {
            title: "Building systems for the real world",
            desc: "Computer Science student focused on automation, observability, and infrastructure, with a solid foundation in backend development.",
        },

        introduction: {
            title: "Hi, I'm Rafael Ghiorzi",
            desc: "I study Computer Science at the University of Brasília, with a strong interest in infrastructure, observability, and backend development. I like to understand how systems behave in real-world scenarios, from development to production. I run a homelab to experiment with containers, automation, and monitoring, and I've published a Python package on PyPI. In my free time, I love listening to and making music. I've been a drummer for years, and I believe learning an instrument is the best way to develop discipline, creativity, and consistency, traits I naturally bring to my work as a developer.",
        },

        projects: {
            title: "Some projects I've worked on",
            desc: "Some of the things I've built and have been experimenting with.",
        },

        projectsData: [
            {
                title: "PdfPlucker",
                desc: "Python package published on PyPI for structured extraction of text, tables, and images from PDFs in batch. Processed hundreds of books in internal research, replacing paid tools, with parallel execution and GPU acceleration.",
                tech: "Python, PyPI, Docling, CLI",
                img: "/plucker.png",
                link: "https://github.com/rafaelghiorzi/pdfplucker",
            },
            {
                title: "Homelab Cookbook",
                desc: "Infrastructure lab validated on virtual machines: Proxmox, service deployment on K3s with auto-scaling, provisioning via Ansible, and an LGTM observability stack (Loki, Grafana, Tempo, Prometheus).",
                tech: "Proxmox, K3s, Ansible, Grafana",
                img: "",
                link: "https://github.com/rafaelghiorzi/homelab-infra",
            },
            {
                title: "Name Extraction – DOE São Paulo",
                desc: "Hybrid pipeline to extract structured data from historical documents (1982–2001), combining layout detection (YOLO), OCR (Document AI), and LLMs. Reached 75% recall on name extraction, outperforming traditional OCR.",
                tech: "Python, YOLO, Document AI, LLMs",
                img: "",
                link: "",
            },
            {
                title: "RAG Publications",
                desc: "Multimodal, multi-agent RAG system for querying a knowledge repository. Indexed around 1,200 documents with ~200ms search latency, deployed with Docker.",
                tech: "Python, FastAPI, Qdrant, Docker",
                img: "/ipeapub.png",
                link: "https://github.com/rafaelghiorzi/IpeaPub",
            },
            {
                title: "Member Management Platform (FGM)",
                desc: "Full-stack platform for managing members and projects of a junior enterprise, used by over 150 members. I worked as developer and project manager, with a documented REST API, tests, and CI/CD.",
                tech: "Next.js, NestJS, PostgreSQL",
                img: "",
                link: "",
            },
            {
                title: "Seu Caminho",
                desc: "Social platform for routes on toll highways, winner (1st place) of the ABCR Innovation Hackathon 2026. Generates personalized routes, compares trips between users, and identifies the responsible operators. I built the complete software.",
                tech: "Web Platform, Geolocation, Routing",
                img: "",
                link: "",
            },
        ],

        experience: {
            title: "Experience",
            desc: "A look at where I've worked.",
        },

        expData: [
            {
                role: "Undergraduate Researcher (PIBIC)",
                company: "University of Brasília — Intent-Based Networking",
                time: "Jun. 2026 - Present",
                desc: "Research on Intent-Based Networking (IBN). I'm building an adaptive telemetry collector in OpenTelemetry format that dynamically adjusts what it collects based on the intents installed on the network, using machine learning to reduce monitoring overhead.",
                tech: "OpenTelemetry, Observability, Machine Learning, Networking",
            },
            {
                role: "Data Science Researcher",
                company:
                    "Institute for Applied Economic Research (IpeaData-Lab)",
                time: "Feb. 2025 - Dec. 2025",
                desc: "Built data pipelines and AI systems. I developed a RAG system that indexed ~1,200 documents with ~200ms latency and published PdfPlucker on PyPI, replacing paid tools. Deployed with Docker on internal infrastructure.",
                tech: "Python, FastAPI, Qdrant, Docker",
            },
            {
                role: "Software Developer & Project Lead",
                company: "Junior Computing Enterprise – CJR",
                time: "Oct. 2023 - Feb. 2025",
                desc: "Developed and led the FGM, a full-stack management system used by over 150 members, with a documented REST API, unit tests, and CI/CD via GitHub Actions. Worked with Scrum/Kanban in two-week sprints.",
                tech: "Next.js, NestJS, Prisma, CI/CD",
            },
        ],

        contact: {
            title: "Contact",
            desc: "Feel free to reach out!",
            github: "https://github.com/rafaelghiorzi",
            linkedin: "https://linkedin.com/in/rafaeldghiorzi",
            cv: "https://looking.cv/rafaeldghiorzi",
        },

        copyright: "© 2026 Rafael Ghiorzi. All rights reserved",
    },
};

export type Lang = "pt" | "en";
