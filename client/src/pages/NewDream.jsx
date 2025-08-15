// src/pages/NewDream.jsx
import React, { useState, useEffect, useRef } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { MentionsInput, Mention } from 'react-mentions'
import { cleanMentions } from '../utils/formatMentions'
import PageNavigation from '../components/PageNavigation'

export default function NewDream() {
  const navigate = useNavigate()
  const [title, setTitle]     = useState('')
  const [pages, setPages]     = useState([''])
  const [currentPage]         = useState(0)
  const [isPublic, setIsPublic] = useState(false)
  const [users, setUsers]     = useState([])
  
  // pageHeight drives h-[…px] and line count; starts at 660px
  const [pageHeight, setPageHeight] = useState(660)
  const textareaRef = useRef(null)
  const LINE_HEIGHT = 30

  // fetch mentionable users
  useEffect(() => {
    const token = localStorage.getItem('token')
    api.get('/users/usernames', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setUsers(res.data.map(u => ({ id: u, display: u }))))
    .catch(err => console.error('Failed to fetch usernames', err))
  }, [])

  // on text change: just update page content,
  // then if scrollHeight > current height, grow by one line
  const handlePageTextChange = (val) => {
    setPages(prev => {
      const next = [...prev]; next[currentPage] = val
      return next
    })
    const el = textareaRef.current
    if (el && el.scrollHeight > pageHeight) {
      setPageHeight(h => h + LINE_HEIGHT)
    }
  }

  // submit: join pages, clean mentions, extract tagged_usernames
  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const full = pages.join('')
    const plain = cleanMentions(full)
    const tagged = Array.from(new Set(
      (full.match(/@\[[^\]]+\]\(([^)]+)\)/g) || [])
        .map(m => m.match(/@\[[^\]]+\]\(([^)]+)\)/)[1])
    ))
    try {
      await api.post(
        '/dreams',
        { title, content: plain, is_public: isPublic, tagged_usernames: tagged },
        { headers: { Authorization: `Bearer ${token}` }}
      )
      navigate('/dashboard')
    } catch (err) {
      console.error('Failed to submit dream:', err.response?.data || err.message)
    }
  }

  // transparent control + input; suggestions unchanged
  const mentionsStyle = {
    control: {
      backgroundColor: 'transparent',
      border: '0px',
      borderRadius: '6px',
      fontSize: 18,
      fontFamily: '"Jersey 10", sans-serif',
      minHeight: '15px',
    },
    input: {
      backgroundColor: 'transparent',
      color: '#000',
      fontFamily: '"Jersey 10", sans-serif',
      padding: '0 10px',
    },
    highlighter: {
      overflow: 'hidden',
      padding: '0 10px',
    },
    suggestions: {
      list: {
        backgroundColor: '#1e1b2e',
        border: '1px solid #d40f95',
        borderRadius: '0.5rem',
        fontSize: 16,
        fontFamily: '"Jersey 10", sans-serif',
        padding: 0,
        marginTop: '4px',
        color: '#ffffff',
      },
      item: {
        padding: '8px 12px',
        cursor: 'pointer',
        borderBottom: '1px solid #d40f9577',
        '&focused': {
          backgroundColor: '#d40f95',
          color: 'white',
        },
      },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
      {/* Notebook‐style page (single, extending) */}
      <div
        className="relative w-[38vw] mt-6 mb-2 font-['Jersey_10']"
        style={{ height: `${pageHeight}px` }}
      >
        {/* stacked corners if you ever add pages */}
        {pages.length > 1 && Array(Math.min(pages.length - currentPage - 1, 4))
          .fill(0).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 left-0 w-full h-full bg-[#eee7d7] border border-gray-300 rounded-xl"
              style={{
                zIndex: -1 * (i + 1),
                transform: `translate(${(i + 1) * 4}px, ${(i + 1) * 4}px)`
              }}
            />
        ))}

        {/* the page itself */}
        <div className="absolute inset-0 bg-[#eee7d7] border border-gray-400 rounded-xl shadow-md overflow-hidden">
          {/* Lined background (dynamic line count) */}
          <div className="absolute inset-0 z-0 pointer-events-none rounded-xl overflow-hidden">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {[...Array(Math.ceil(pageHeight / LINE_HEIGHT))].map((_, i) => (
                <line
                  key={i}
                  x1="8%"
                  x2="92%"
                  y1={LINE_HEIGHT * (i + 1)}
                  y2={LINE_HEIGHT * (i + 1)}
                  stroke="#bbb"
                  strokeWidth="1"
                />
              ))}
            </svg>
          </div>

          {/* Title on page 0 */}
          {currentPage === 0 && (
            <div className="flex items-center pt-[5px] text-black leading-[30px] px-[8%]">
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Dream Title"
                maxLength={26}
                className="w-full bg-transparent border-none text-xl focus:outline-none"
                required
              />
            </div>
          )}

          {/* Content entry */}
          <div className="relative z-10 px-[8%] pt-[6px] leading-[30px] text-black whitespace-pre-wrap font-['Jersey_10'] h-[calc(100%-60px)]">
            <MentionsInput
              inputRef={textareaRef}
              style={{ ...mentionsStyle, input: { ...mentionsStyle.input, minHeight: `${pageHeight - 60}px` } }}
              value={pages[currentPage]}
              onChange={e => handlePageTextChange(e.target.value)}
              placeholder="Describe your dream and tag users with @"
            >
              <Mention
                trigger="@"
                data={(q, cb) =>
                  cb(users.filter(u => u.id.toLowerCase().startsWith(q.toLowerCase())))
                }
                markup="@\\[__display__\\](__id__)"
                displayTransform={id => `@${id}`}
              />
            </MentionsInput>
          </div>

          {/* Page nav (won’t show when pages.length===1) */}
          {pages.length > 1 && (
            <PageNavigation
              currentPage={currentPage}
              totalPages={pages.length}
              setCurrentPage={() => {}}
            />
          )}
        </div>
      </div>

      {/* public checkbox */}
      <div className="flex items-center gap-2 text-white jersey-10-regular">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={e => setIsPublic(e.target.checked)}
          className="checkbox"
        />
        <label>Make public</label>
      </div>

      {/* action buttons */}
      <div className="flex gap-4 w-full max-w-xs">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex-1 btn bg-gray-600 hover:bg-gray-700 text-white font-pixelify"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 btn bg-highlight hover:bg-[#b80c7e] text-white font-pixelify"
        >
          Submit Dream
        </button>
      </div>
    </form>
  )
}
