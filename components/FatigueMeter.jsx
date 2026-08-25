'use client';

import React from 'react';

const STATUS_BANDS = [
  {
    max: 20,
    label: 'Fresh',
    tone: 'fresh',
    color: '#22c55e',
    hint: 'Recruiter is perky. Keep pressure light and professional.'
  },
  {
    max: 45,
    label: 'Warming',
    tone: 'warming',
    color: '#84cc16',
    hint: 'They are listening, but still holding the line.'
  },
  {
    max: 70,
    label: 'Tired',
    tone: 'tired',
    color: '#f59e0b',
    hint: 'Replies are getting shorter. A small concession may be near.'
  },
  {
    max: 90,
    label: '