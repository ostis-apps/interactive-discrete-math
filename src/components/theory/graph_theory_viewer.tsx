import { useEffect, useState } from 'preact/hooks';
import { client } from './client_source/client/src/new_client.ts';

export const GraphTheoryViewer = () => {
  // Состояния
  const [currentPage, setCurrentPage] = useState(1);
  const [renderedHtml, setRenderedHtml] = useState('');
  const [language, setLanguage] = useState<'ru' | 'eng'>('ru');
  const [sectionTitle, setSectionTitle] = useState('');
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'sections' | 'topics' | 'content' | 'video'>('sections');
  const [rus1, setRus1] = useState<any>(null);
  const [eng1, setEng1] = useState<any>(null);
  
  async function fetchRus1Link() {
    console.log('start rus1 fetching...');
    const res = await client.getLinkContents([419192]);
    console.log('rus1 fetched succesfully', res);
    setRus1(res);
    return res;
  }
  
  async function fetchEng1Link() {
  console.log('start eng1 fetching...');
    const res = await client.getLinkContents([419198]);
    console.log('eng1 fetched succesfully', res);
    setEng1(res);
    return res;
  }

  console.log('file is loaded');
  useEffect(() => {
    console.log('start loading data...');
    fetchRus1Link();
    fetchEng1Link();
    console.log('data loaded succes');
  }, []);

  // Полные данные разделов и тем
  const sections = [
    { 
      id: 1, 
      name: 'Первый раздел', 
      nameEng: 'First section',
      topics: [
        { 
          id: 1, 
          name: 'Определения и примеры', 
          nameEng: 'Definitions and examples', 
          page: 1, 
          videoUrls: {
            ru: rus1,
            eng: eng1
          } 
        },
        { 
          id: 2, 
          name: 'Способы задания графов', 
          nameEng: 'Methods of defining graphs', 
          page: 2, 
          videoUrls: null 
        }
      ]
    },
    { 
      id: 2, 
      name: 'Второй раздел', 
      nameEng: 'Second section',
      topics: [
        { id: 1, name: 'Типы графов', nameEng: 'Graph types', page: 3, videoUrls: null },
        { id: 2, name: 'Подграфы', nameEng: 'Subgraphs', page: 4, videoUrls: null },
        { id: 3, name: 'Сильно связные графы и компоненты графа', nameEng: 'Strongly connected graphs and graph components', page: 5, videoUrls: null },
        { id: 4, name: 'Маршруты, цепи пути и циклы', nameEng: 'Routes, path chains and cycles', page: 6, videoUrls: null },
        { id: 5, name: 'Связность и компоненты графа', nameEng: 'Connectivity and graph components', page: 7, videoUrls: null },
        { id: 6, name: 'Операции над графами', nameEng: 'Graph operations', page: 8, videoUrls: null },
        { id: 7, name: 'Матрицы смежности и инцидентности', nameEng: 'Adjacency and incidence matrices', page: 9, videoUrls: null }
      ]
    },
    { 
      id: 3, 
      name: 'Третий раздел', 
      nameEng: 'Third section',
      topics: [
        { id: 1, name: 'Определения и примеры', nameEng: 'Definitions and examples', page: 10, videoUrls: null },
        { id: 2, name: 'Орграфы и матрицы', nameEng: 'Digraphs and matrices', page: 11, videoUrls: null },
        { id: 3, name: 'Ориентированные эйлеровы графы', nameEng: 'Directed Eulerian graphs', page: 12, videoUrls: null }
      ]
    },
    { 
      id: 4, 
      name: 'Четвёртый раздел', 
      nameEng: 'Fourth section',
      topics: [
        { id: 1, name: 'Ориентированные ациклические графы', nameEng: 'Directed Acyclic Graphs', page: 13, videoUrls: null },
        { id: 2, name: 'Деревья', nameEng: 'Trees', page: 14, videoUrls: null }
      ]
    },
    { 
      id: 5, 
      name: 'Пятый раздел', 
      nameEng: 'Fifth section',
      topics: [
        { id: 1, name: 'Планарные графы', nameEng: 'Planar graphs', page: 15, videoUrls: null },
        { id: 2, name: 'Точки сочленения, мосты и блоки', nameEng: 'Articulation Points, Bridges, and Blocks', page: 16, videoUrls: null },
        { id: 3, name: 'Двойственные графы', nameEng: 'Dual Graphs', page: 17, videoUrls: null }
      ]
    },
    { 
      id: 6, 
      name: 'Шестой раздел', 
      nameEng: 'Sixth section',
      topics: [
        { id: 1, name: 'Исследование лабиринта', nameEng: 'Maze exploration', page: 18, videoUrls: null },
        { id: 2, name: 'Поиск в глубину', nameEng: 'Depth-first search', page: 19, videoUrls: null },
        { id: 3, name: 'Поиск в ширину', nameEng: 'Breadth-first search', page: 20, videoUrls: null },
        { id: 4, name: 'Нахождение кратчайшего пути (Алгоритм Дейкстры)', nameEng: 'Finding the shortest path (Dijkstra\'s Algorithm)', page: 21, videoUrls: null }
      ]
    }
  ];

  // Навигация
  const goToSections = () => {
    setSelectedSection(null);
    setSelectedTopic(null);
    setCurrentScreen('sections');
  };

  const goToTopics = (sectionId: number) => {
    setSelectedSection(sectionId);
    setCurrentScreen('topics');
  };

  const goToContent = (topicId: number, page: number) => {
    setSelectedTopic(topicId);
    setCurrentPage(page);
    setCurrentScreen('content');
  };

  const goToVideo = (topicId: number) => {
    setSelectedTopic(topicId);
    setCurrentScreen('video');
  };

  const extractSectionTitle = (html: string) => {
    const lines = html.split('\n');
    
    const cleanText = (line: string) => {
      return line
        .replace(/<[^>]*>/g, ' ') // Удаляем HTML-теги
        .replace(/@page\s*{[^}]*}/g, '') // Удаляем @page правила
        .replace(/\.[a-zA-Z\-]+\s*{[^}]*}/g, '') // Удаляем классы CSS
        .replace(/[a-zA-Z\-]+:\s*[^;]+;/g, '') // Удаляем CSS свойства
        .replace(/\s+/g, ' ') // Удаляем лишние пробелы
        .trim();
    };

    const lineChecks = [
      [19, 20], [18, 19], [22, 23], 
      [23, 24], [27, 28], [32, 33], 
      [36, 37]
    ];

    for (const [line1, line2] of lineChecks) {
      const text1 = cleanText(lines[line1] || '');
      const text2 = cleanText(lines[line2] || '');
      const combinedText = `${text1} ${text2}`.trim();
      
      if (combinedText.length > 3 && 
          !combinedText.startsWith('@') && 
          !combinedText.match(/[{}:]/)) {
        return combinedText;
      }
    }

    const singleLines = [18, 19, 20, 22, 23, 24, 27, 28, 32, 33, 36, 37];
    for (const lineNum of singleLines) {
      const text = cleanText(lines[lineNum] || '');
      if (text.length > 3 && !text.match(/[{}:@]/)) {
        return text;
      }
    }

    return language === 'ru' ? 'Название раздела' : 'Section title';
  };

  // Загрузка контента страницы
  const loadPageContent = async (page: number, lang: 'ru' | 'eng') => {
    try {
      let html = '';
      
      if (page <= 2) {
        const baseName = page === 1 ? '1.1' : '1.2';
        const fileName = lang === 'ru' ? baseName : `${baseName}_eng`;
        html = await import(`./graph_source/content/${fileName}.html?raw`).then(m => m.default);
      }
      else if (page <= 9) {
        const baseName = `2.${page - 2}`;
        const fileName = lang === 'ru' ? baseName : `${baseName}_eng`;
        html = await import(`./graph_source/content2/${fileName}.html?raw`).then(m => m.default);
      }
      else if (page <= 12) {
        const baseName = `3.${page - 9}`;
        const fileName = lang === 'ru' ? baseName : `${baseName}_eng`;
        html = await import(`./graph_source/content3/${fileName}.html?raw`).then(m => m.default);
      }
      else if (page <= 14) {
        const baseName = `4.${page - 12}`;
        const fileName = lang === 'ru' ? baseName : `${baseName}_eng`;
        html = await import(`./graph_source/content4/${fileName}.html?raw`).then(m => m.default);
      }
      else if (page <= 17) {
        const baseName = `5.${page - 14}`;
        const fileName = lang === 'ru' ? baseName : `${baseName}_eng`;
        html = await import(`./graph_source/content5/${fileName}.html?raw`).then(m => m.default);
      }
      else {
        const baseName = `6.${page - 17}`;
        const fileName = lang === 'ru' ? baseName : `${baseName}_eng`;
        html = await import(`./graph_source/content6/${fileName}.html?raw`).then(m => m.default);
      }

      const title = extractSectionTitle(html);
      setSectionTitle(title);
      
      return html;
    } catch (error) {
      console.error(`Error loading page ${page} (${lang}):`, error);
      return `
        <html>
          <body style="font-family: Arial; padding: 20px;">
            <h1 style="color: red;">${lang === 'ru' ? 'Ошибка загрузки' : 'Loading error'}</h1>
            <p>${lang === 'ru' ? 'Не удалось загрузить страницу' : 'Failed to load page'} ${page}</p>
            <p>${error.message}</p>
          </body>
        </html>
      `;
    }
  };

  // Загрузка контента при изменении страницы
  useEffect(() => {
    if (currentScreen === 'content' && selectedTopic !== null) {
      const loadPage = async () => {
        const html = await loadPageContent(currentPage, language);
        setRenderedHtml(html);
      };
      loadPage();
    }
  }, [currentPage, language, selectedTopic, currentScreen]);

  // Генерация URL для iframe
  const getIframeSrc = () => {
    const blob = new Blob([renderedHtml], { type: 'text/html' });
    return URL.createObjectURL(blob);
  };

  // Получение текущего раздела и темы
  const currentSection = sections.find(s => s.id === selectedSection);
  const currentTopic = currentSection?.topics.find(t => t.id === selectedTopic);

  // Рендер экрана выбора разделов
  const renderSectionSelection = () => (
    <div class="flex flex-col h-full p-5">
      <h2 class="py-1 text-2xl">{language === 'ru' ? 'Выберите раздел' : 'Select section'}</h2>
      <div class="flex flex-col flex-wrap justify-center gap-4 px-10 py-2 sm:flex-row sm:justify-start sm:px-0">
        {sections.map(section => (
          <div
            key={section.id}
            class="flex h-24 w-full items-center justify-center rounded-lg border-2 border-dashed border-[#DCDCDC] cursor-pointer hover:border-[#B8B8B8] hover:bg-[#F5F5F5] text-center text-sm font-medium transition-all sm:w-48"
            onClick={() => goToTopics(section.id)}
          >
            {language === 'ru' ? section.name : section.nameEng}
          </div>
        ))}
      </div>
    </div>
  );

  // Рендер экрана выбора тем
  const renderTopicSelection = () => {
    if (!currentSection) return goToSections();

    return (
      <div class="flex flex-col h-full p-5">
        <div class="flex justify-between items-center mb-4">
          <button 
            onClick={goToSections}
            class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            ← {language === 'ru' ? 'К разделам' : 'To sections'}
          </button>
          <h2 class="text-xl">{language === 'ru' ? currentSection.name : currentSection.nameEng}</h2>
          <div></div>
        </div>
        
        <div class="flex flex-col flex-wrap justify-center gap-4 px-10 py-2 sm:flex-row sm:justify-start sm:px-0">
          {currentSection.topics.map(topic => (
            <div
              key={topic.id}
              class="flex flex-col h-24 w-full items-center justify-center rounded-lg border-2 border-dashed border-[#DCDCDC] cursor-pointer hover:border-[#B8B8B8] hover:bg-[#F5F5F5] text-center text-sm font-medium transition-all sm:w-48"
              onClick={() => goToContent(topic.id, topic.page)}
            >
              {language === 'ru' ? topic.name : topic.nameEng}
              
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Рендер экрана с контентом
  const renderContent = () => {
    if (!currentSection || !currentTopic) return goToSections();

    return (
      <div class="flex flex-col h-full">
        {/* Панель навигации */}
        <div class="flex justify-between items-center p-2 bg-gray-100 border-b">
          <div class="flex gap-2">
            <button
              onClick={() => setCurrentScreen('topics')}
              class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              ← {language === 'ru' ? 'К темам' : 'To topics'}
            </button>
            <button
              onClick={goToSections}
              class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              {language === 'ru' ? 'К разделам' : 'To sections'}
            </button>
            <button
              onClick={() => window.location.href = '/'}
              class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              {language === 'ru' ? 'В главное меню' : 'To main menu'}
            </button>
          </div>
          
          <div class="flex gap-2">
            <button
              onClick={() => setLanguage('ru')}
              class={`px-3 py-1 rounded ${language === 'ru' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Русский
            </button>
            <button
              onClick={() => setLanguage('eng')}
              class={`px-3 py-1 rounded ${language === 'eng' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              English
            </button>
          </div>
        </div>

        {/* Информация о текущей теме */}
        <div class="flex justify-between items-center p-2 bg-gray-50 border-b">
          <div class="text-sm font-medium">
            {language === 'ru' ? 'Тема' : 'Topic'}: {language === 'ru' ? currentTopic.name : currentTopic.nameEng}
          </div>
          
          {currentTopic.videoUrls && (
            <button
              onClick={() => goToVideo(currentTopic.id)}
              class="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              {language === 'ru' ? 'Перейти к видео' : 'Go to video'}
            </button>
          )}
        </div>

        {/* Контейнер с контентом */}
        {renderedHtml && (
          <iframe 
            src={getIframeSrc()}
            class="w-full flex-1 border-none"
            sandbox="allow-same-origin"
            title={`Page ${currentPage} (${language})`}
            key={`${currentPage}-${language}`}
          />
        )}
      </div>
    );
  };

  // Рендер экрана с видео
  const renderVideo = () => {
    if (!currentSection || !currentTopic) return goToSections();

    const videoUrl = currentTopic.videoUrls ? currentTopic.videoUrls[language] : null;
    const videoId = videoUrl?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1] || '';
    
    return (
      <div class="flex flex-col h-full">
        {/* Панель навигации */}
        <div class="flex justify-between items-center p-2 bg-gray-100 border-b">
          <div class="flex gap-2">
            <button
              onClick={() => setCurrentScreen('content')}
              class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              ← {language === 'ru' ? 'К теме' : 'To topic'}
            </button>
            <button
              onClick={() => setCurrentScreen('topics')}
              class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              {language === 'ru' ? 'К темам' : 'To topics'}
            </button>
            <button
              onClick={goToSections}
              class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              {language === 'ru' ? 'К разделам' : 'To sections'}
            </button>
          </div>
          
          <div class="flex gap-2">
            <button
              onClick={() => setLanguage('ru')}
              class={`px-3 py-1 rounded ${language === 'ru' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Русский
            </button>
            <button
              onClick={() => setLanguage('eng')}
              class={`px-3 py-1 rounded ${language === 'eng' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              English
            </button>
          </div>
        </div>

        {/* Информация о текущей теме */}
        <div class="flex justify-between items-center p-2 bg-gray-50 border-b">
          <div class="text-sm font-medium">
            {language === 'ru' ? 'Видео по теме' : 'Video for topic'}: {language === 'ru' ? currentTopic.name : currentTopic.nameEng}
          </div>
        </div>

        {/* Контейнер с видео */}
        <div class="flex-1 overflow-auto p-4">
          {videoUrl ? (
            <div class="flex flex-col items-center h-full">
              <div class="w-full max-w-4xl h-full">
                <div class="relative h-0 pb-[56.25%]"> {/* 16:9 Aspect Ratio */}
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    class="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={language === 'ru' ? 'Видео по теме' : 'Topic video'}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div class="flex items-center justify-center h-full">
              <p class="text-gray-500">
                {language === 'ru' ? 'Для этой темы нет видео' : 'No videos available for this topic'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Выбор экрана для отображения
  switch (currentScreen) {
    case 'topics':
      return renderTopicSelection();
    case 'content':
      return renderContent();
    case 'video':
      return renderVideo();
    default:
      return renderSectionSelection();
  }
};
