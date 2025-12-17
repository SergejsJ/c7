'use client'

import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [actionType, setActionType] = useState<string | null>(null)
  const [urlError, setUrlError] = useState(false)

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUrl(value)
    setUrlError(false)
  }

  const validateUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  const handleAction = async (type: 'summary' | 'theses' | 'telegram') => {
    const trimmedUrl = url.trim()
    
    if (!trimmedUrl) {
      setUrlError(true)
      return
    }

    if (!validateUrl(trimmedUrl)) {
      setUrlError(true)
      return
    }

    setIsLoading(true)
    setActionType(type)
    setResult(null)

    // Имитация обработки (здесь будет реальная логика парсинга и AI)
    setTimeout(() => {
      const mockResults = {
        summary: `Статья по адресу ${trimmedUrl} рассказывает о важных аспектах современной технологии и её применении в различных сферах жизни.`,
        theses: `• Основная тема статьи: технологические инновации\n• Ключевые моменты: развитие, применение, перспективы\n• Выводы: значимость для будущего развития`,
        telegram: `📰 Новая статья!\n\n🔗 ${trimmedUrl}\n\nИнтересные факты и анализ в статье. Рекомендую к прочтению!`
      }
      
      setResult(mockResults[type])
      setIsLoading(false)
    }, 2000)
  }

  const handleClear = () => {
    setUrl('')
    setResult(null)
    setActionType(null)
    setUrlError(false)
  }

  const isUrlValid = url.trim() !== '' && validateUrl(url.trim())

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
      {/* Декоративные элементы фона с blob-эффектами */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Заголовок */}
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <div className="mb-3 flex justify-center">
            <img 
              src="/robot-icon.png" 
              alt="Robot AI" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700 leading-tight">
            Референт - переводчик с использованием ИИ
          </h1>
        </div>

        {/* Секция ввода URL */}
        <div style={{ marginBottom: '40px' }}>
          <p className="text-gray-700 text-sm sm:text-base" style={{ marginBottom: '16px' }}>
            Введите URL англоязычной статьи для анализа и получения перевода
          </p>
          <div className="relative">
            <input
              type="text"
              id="url"
              value={url}
              onChange={handleUrlChange}
              className={`w-full px-4 pr-12 py-3 text-base text-gray-900 border rounded-md focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all duration-200 break-all ${
                urlError 
                  ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 bg-white hover:border-purple-300'
              } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="URL статьи"
              disabled={isLoading}
              autoComplete="off"
              onBlur={() => {
                if (url.trim() && !validateUrl(url.trim())) {
                  setUrlError(true)
                }
              }}
            />
            {url && (
              <button
                onClick={() => {
                  setUrl('')
                  setUrlError(false)
                  setResult(null)
                  setActionType(null)
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 rounded p-1 transition-colors"
                type="button"
                disabled={isLoading}
                style={{ color: '#dc2626' }}
                title="Очистить результат и URL"
              >
                <span className="text-xl" style={{ filter: 'none' }}>🗑️</span>
              </button>
            )}
            {urlError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span>
                <span>Пожалуйста, введите корректный URL</span>
              </p>
            )}
          </div>
        </div>

        {/* Секция кнопок действий */}
        <div style={{ marginBottom: '40px' }}>
          <p className="text-gray-700 text-sm sm:text-base" style={{ marginBottom: '16px' }}>
            Выберите действие:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleAction('summary')}
              disabled={isLoading || !isUrlValid}
              className="bg-purple-500 text-white rounded-md font-medium hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              style={{ paddingTop: '15px', paddingBottom: '15px', paddingLeft: '14px', paddingRight: '14px' }}
            >
              <span className="text-white">📄</span>
              <span>О чем статья?</span>
            </button>
            
            <button
              onClick={() => handleAction('theses')}
              disabled={isLoading || !isUrlValid}
              className="bg-green-500 text-white rounded-md font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              style={{ paddingTop: '15px', paddingBottom: '15px', paddingLeft: '14px', paddingRight: '14px' }}
            >
              <span className="text-white">📝</span>
              <span>Тезисы</span>
            </button>
            
            <button
              onClick={() => handleAction('telegram')}
              disabled={isLoading || !isUrlValid}
              className="bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              style={{ paddingTop: '15px', paddingBottom: '15px', paddingLeft: '14px', paddingRight: '14px' }}
            >
              <span className="text-white">✈️</span>
              <span>Пост для Telegram</span>
            </button>
          </div>
        </div>

        {/* Секция результата */}
        <div className="bg-gray-100 rounded-md p-4" style={{ minHeight: '20px' }}>
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              </div>
              <span className="text-gray-700">Генерация результата...</span>
            </div>
          ) : result ? (
            <div>
              <div className="mb-3 text-gray-700 font-medium flex items-center gap-2">
                <span>
                  {actionType === 'summary' ? '📄' : actionType === 'theses' ? '📝' : '✈️'}
                </span>
                <span>
                  {actionType === 'summary' ? 'О чем статья?' : actionType === 'theses' ? 'Тезисы' : 'Пост для Telegram'}
                </span>
              </div>
              <div className="text-gray-800 whitespace-pre-wrap break-words overflow-wrap-anywhere word-break-break-all">
                {result}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center">Результат будет отображен здесь</p>
          )}
        </div>
      </div>
    </main>
  )
}
