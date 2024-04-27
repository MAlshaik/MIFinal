'use server';

import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const supabase = createClient();

  // You'll likely still need this to get the user_id if your RLS policy requires it 
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    // Consider redirection logic using NextResponse.redirect(...)
    redirect('/login');
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }
  const user = data.user; 

  // Get the content from the request body
  let content;
  try {
    content = await req.json(); 
  } catch (error) {
    return NextResponse.json({ error: 'Error parsing request body' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('notes')
      .insert({ user_id: user.id, content: content.content }); // Adapt if needed

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 }); 
    }

    return NextResponse.json({ message: 'Note saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('SAVE ERROR:', error);
    return NextResponse.json({ error: 'Unexpected error saving note' }, { status: 500 }); 
  }
}

