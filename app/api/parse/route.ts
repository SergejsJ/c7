import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Загружаем HTML страницы
    let response: Response
    try {
      response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      })
    } catch (fetchError: any) {
      return NextResponse.json({ 
        error: `Ошибка при загрузке URL: ${fetchError.message}` 
      }, { status: 500 })
    }

    if (!response.ok) {
      return NextResponse.json({ 
        error: `Не удалось загрузить страницу. Статус: ${response.status}` 
      }, { status: response.status })
    }

    const html = await response.text()
    
    if (!html || html.length === 0) {
      return NextResponse.json({ 
        error: 'Получена пустая страница' 
      }, { status: 500 })
    }

    const $ = cheerio.load(html)

    // Ищем заголовок статьи
    let title = ''
    const titleSelectors = [
      'h1',
      'article h1',
      '.post-title',
      '.article-title',
      '[class*="title"]',
      'title'
    ]
    
    for (const selector of titleSelectors) {
      const found = $(selector).first().text().trim()
      if (found && found.length > 10) {
        title = found
        break
      }
    }

    // Если не нашли, берем из meta тега
    if (!title) {
      title = $('meta[property="og:title"]').attr('content') || 
              $('meta[name="title"]').attr('content') || 
              $('title').text().trim() || 
              ''
    }

    // Ищем дату
    let date = ''
    const dateSelectors = [
      'time[datetime]',
      'time',
      '[class*="date"]',
      '[class*="published"]',
      '[class*="time"]',
      'article time',
      '.post-date',
      '.article-date'
    ]

    for (const selector of dateSelectors) {
      const found = $(selector).first()
      date = found.attr('datetime') || 
             found.attr('title') || 
             found.text().trim() || 
             ''
      if (date) break
    }

    // Если не нашли, ищем в meta тегах
    if (!date) {
      date = $('meta[property="article:published_time"]').attr('content') ||
             $('meta[name="date"]').attr('content') ||
             $('meta[name="published"]').attr('content') ||
             ''
    }

    // Ищем основной контент
    let content = ''
    const contentSelectors = [
      'article',
      '.post',
      '.content',
      '.article-content',
      '[class*="article"]',
      '[class*="post-content"]',
      'main',
      '.entry-content'
    ]

    for (const selector of contentSelectors) {
      const found = $(selector).first()
      if (found.length > 0) {
        // Удаляем ненужные элементы (скрипты, стили, реклама и т.д.)
        found.find('script, style, nav, header, footer, aside, .ad, .advertisement, .sidebar').remove()
        content = found.text().trim()
        if (content && content.length > 100) {
          break
        }
      }
    }

    // Если не нашли, берем body
    if (!content || content.length < 100) {
      const body = $('body')
      body.find('script, style, nav, header, footer, aside, .ad, .advertisement, .sidebar').remove()
      content = body.text().trim()
    }

    // Очищаем контент от лишних пробелов
    content = content.replace(/\s+/g, ' ').trim()

    return NextResponse.json({
      date: date || 'Не найдено',
      title: title || 'Не найдено',
      content: content || 'Не найдено'
    })

  } catch (error: any) {
    console.error('Parse error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to parse URL' },
      { status: 500 }
    )
  }
}

