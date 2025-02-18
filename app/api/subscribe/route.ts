// app/api/subscribe/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    // Basic email validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { message: 'Invalid email address.' }, 
        { status: 422 }
      )
    }
    
    const { db } = await connectToDatabase()
    
    // Check if email already exists in the emaillist
    const existingEmail = await db.collection('emaillist').findOne({ email })
    
    if (existingEmail) {
      return NextResponse.json(
        { message: "You're already subscribed! Maybe through one of my other projects..." }, 
        { status: 409 }
      )
    }
    
    // Save new email subscription with "newsletter" source and "filterx" project
    await db.collection('emaillist').insertOne({
      email,
      source: 'newsletter',
      project: 'filterx',
      subscribedAt: new Date(),
    })
    
    return NextResponse.json(
      { message: "You're subscribed!" }, 
      { status: 201 }
    )
    
  } catch (error) {
    console.error('MongoDB error:', error)
    return NextResponse.json(
      { message: 'Something went wrong. Please try again later.' }, 
      { status: 500 }
    )
  }
}
