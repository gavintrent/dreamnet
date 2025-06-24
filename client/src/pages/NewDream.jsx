import React, { useState, useEffect } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { MentionsInput, Mention } from 'react-mentions'
import { cleanMentions } from '../utils/formatMentions'

export default function NewDream() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    is_public: false,
  })
  const navigate = useNavigate()
  const [users, setUsers] = useState([])

  useEffect(() => {
    api
      .get('/users/usernames')
      .then((res) => {
        setUsers(res.data.map((username) => ({ id: username, display: username })))
      })
      .catch((err) => console.error('Failed to fetch usernames', err))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const plainContent = cleanMentions(form.content)
    const mentionedUsers = [...new Set((form.content.match(/@(\w+)/g) || []).map((u) => u.slice(1)))]

    try {
      await api.post(
        '/dreams',
        {
          title: form.title,
          content: plainContent,
          is_public: form.is_public,
          tagged_usernames: mentionedUsers,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      navigate('/dashboard')
    } catch (err) {
      console.error('Failed to submit dream:', err.response?.data || err.message)
    }
  }

  const mentionsStyle = {
    control: {
      backgroundColor: '#ffffff',
      border: '1px solid #ccc',
      borderRadius: '6px',
      fontSize: 18,
      fontFamily: '"Jersey 10", sans-serif',
      minHeight: '15px',
    },
    input: {
      color: '#000000',
      minHeight: '150px',
      fontFamily: '"Jersey 10", sans-serif',
      padding: '0px 10px',
    },
    highlighter: {
      overflow: 'hidden',
      padding: '0px 10px',
      minHeight: '150px',
    },
    suggestions: {
      list: {
        backgroundColor: '#1e1b2e',        // dark dreamy background
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
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-xl bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-lg mt-16">
          <h2 className="text-3xl text-center jersey-10-regular text-white mb-6">
            New Dream Entry
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-white jersey-10-regular">
                Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="Dream title"
                className="w-full input input-bordered bg-white text-black jersey-10-regular text-xl"
              />
            </div>

            <div>
              <label className="block mb-1 text-white jersey-10-regular">
                Describe your Dream...
              </label>
              <MentionsInput
                style={mentionsStyle}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Describe your dream and tag users with @"
              >
                <Mention
                  trigger="@"
                  data={(query, callback) => {
                    const results = users
                      .filter((u) => u.id.toLowerCase().startsWith(query.toLowerCase()))
                      .map((u) => ({ id: u.id, display: u.display }))
                    callback(results)
                  }}
                  markup="@\[__display__\](__id__)"
                  displayTransform={(id) => `@${id}`}
                />
              </MentionsInput>
            </div>

            <div className="flex items-center gap-2 text-white jersey-10-regular">
              <input
                type="checkbox"
                name="is_public"
                checked={form.is_public}
                onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
                className="checkbox"
              />
              <label>Make public</label>
            </div>

            <button
              type="submit"
              className="w-full btn bg-[#EB5FC1] hover:bg-[#b80c7e] text-white font-pixelify"
            >
              Submit Dream
            </button>
          </form>
        </div>
      </div>
  )
}
