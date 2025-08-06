// File: config/schema.js

import { pgTable, varchar, integer, boolean, jsonb, text, uuid } from "drizzle-orm/pg-core";

// Define the users table
export const usersTable = pgTable("users", {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  age: integer('age').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  SubscriptionId: varchar('SubscriptionId', { length: 255 }).notNull()
});

// Define the courses table
export const courseTable = pgTable("courses", {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  cid: uuid('cid').defaultRandom().notNull().unique(),
  courseName: varchar('courseName', { length: 255 }).notNull(),
  courseDescription: text('courseDescription').notNull(),
  courseChapters: integer('courseChapters').notNull(),
  includeVideo: boolean('includeVideo').notNull(),
  level: varchar('level', { length: 50 }).notNull(),
  courseCategory: varchar('courseCategory', { length: 100 }).notNull(),
  courseJson: jsonb('courseJson'), // Using jsonb is slightly better
  bannerImageUrl: text('bannerImageUrl'),
  userId: varchar('userId', { length: 255 }).notNull().references(() => usersTable.email),
  isPublished: boolean('isPublished').default(false).notNull(),
});

// Define the enrollCourse table
export const enrollCourseTable = pgTable("enrollCourse",{
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  courseId: uuid('courseId').notNull().references(() => courseTable.cid),
  userEmail: varchar('userEmail').notNull().references(() => usersTable.email),
  completedChapters: jsonb('completedChapters').default([]), 
  passedChapters: jsonb('passedChapters').default([]),
});
