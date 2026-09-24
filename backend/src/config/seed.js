import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Level from "../models/level.model.js";
import Stream from "../models/stream.model.js";
import Type from "../models/type.model.js";
import Language from "../models/language.model.js";
import Subject from "../models/subject.model.js";
import PDF from "../models/pdf.model.js";
import User from "../models/user.model.js";

export const seedDatabase = async () => {
    try {
        console.log("🌱 Checking MongoDB database for initial seed data...");

        // 1. Seed Levels
        let olLevel = await Level.findOne({ name: "Ordinary Level (O/L)" });
        if (!olLevel) {
            olLevel = await Level.create({ name: "Ordinary Level (O/L)" });
        }
        let alLevel = await Level.findOne({ name: "Advanced Level (A/L)" });
        if (!alLevel) {
            alLevel = await Level.create({ name: "Advanced Level (A/L)" });
        }

        // 2. Seed Streams
        const streamNames = [
            "Physical Science (Maths)",
            "Biological Science",
            "Commerce",
            "Arts",
            "Technology (ET/BST)",
            "Information Technology (ICT)"
        ];
        const streamMap = {};
        for (const name of streamNames) {
            let stream = await Stream.findOne({ name });
            if (!stream) {
                stream = await Stream.create({ name });
            }
            streamMap[name] = stream._id;
        }

        // 3. Seed Types
        let ppType = await Type.findOne({ name: "Past Paper" });
        if (!ppType) {
            ppType = await Type.create({ name: "Past Paper" });
        }
        let msType = await Type.findOne({ name: "Marking Scheme" });
        if (!msType) {
            msType = await Type.create({ name: "Marking Scheme" });
        }

        // 4. Seed Mediums / Languages
        const defaultMediums = [
            { name: "Sinhala", code: "SI" },
            { name: "English", code: "EN" },
            { name: "Tamil", code: "TA" }
        ];
        for (const med of defaultMediums) {
            let found = await Language.findOne({ name: med.name });
            if (!found) {
                await Language.create(med);
            }
        }


        // 4. Seed Users
        const adminUser = await User.findOne({ email: "admin@pastpapers.lk" });
        if (!adminUser) {
            const admin = new User({
                username: "System Administrator",
                email: "admin@pastpapers.lk",
                password: "admin123", // Will be hashed by pre-save
                role: "admin"
            });
            await admin.save();
            console.log("👑 Default Admin Account created: admin@pastpapers.lk / admin123");
        }

        const studentUser = await User.findOne({ email: "student@pastpapers.lk" });
        if (!studentUser) {
            const student = new User({
                username: "Kasun Perera",
                email: "student@pastpapers.lk",
                password: "student123",
                role: "user"
            });
            await student.save();
            console.log("👤 Default Student Account created: student@pastpapers.lk / student123");
        }

        // 5. Seed Subjects
        const initialSubjects = [
            // O-Level
            { name: "Mathematics", levelId: olLevel._id, streamIds: [] },
            { name: "Science", levelId: olLevel._id, streamIds: [] },
            { name: "English Language", levelId: olLevel._id, streamIds: [] },
            { name: "Sinhala Language & Literature", levelId: olLevel._id, streamIds: [] },
            { name: "History", levelId: olLevel._id, streamIds: [] },
            { name: "Information & Communication Technology", levelId: olLevel._id, streamIds: [] },
            { name: "Buddhism", levelId: olLevel._id, streamIds: [] },
            { name: "Commerce & Accounting", levelId: olLevel._id, streamIds: [] },
            { name: "Geography", levelId: olLevel._id, streamIds: [] },
            { name: "Health & Physical Education", levelId: olLevel._id, streamIds: [] },
            { name: "Art", levelId: olLevel._id, streamIds: [] },
            { name: "Music", levelId: olLevel._id, streamIds: [] },

            // A-Level
            { name: "Combined Mathematics", levelId: alLevel._id, streamIds: [streamMap["Physical Science (Maths)"]] },
            { name: "Physics", levelId: alLevel._id, streamIds: [streamMap["Physical Science (Maths)"], streamMap["Biological Science"]] },
            { name: "Chemistry", levelId: alLevel._id, streamIds: [streamMap["Physical Science (Maths)"], streamMap["Biological Science"]] },
            { name: "Biology", levelId: alLevel._id, streamIds: [streamMap["Biological Science"]] },
            { name: "Accounting", levelId: alLevel._id, streamIds: [streamMap["Commerce"]] },
            { name: "Business Studies", levelId: alLevel._id, streamIds: [streamMap["Commerce"]] },
            { name: "Economics", levelId: alLevel._id, streamIds: [streamMap["Commerce"], streamMap["Arts"]] },
            { name: "Engineering Technology", levelId: alLevel._id, streamIds: [streamMap["Technology (ET/BST)"]] },
            { name: "Bio Systems Technology", levelId: alLevel._id, streamIds: [streamMap["Technology (ET/BST)"]] },
            { name: "Science for Technology (SFT)", levelId: alLevel._id, streamIds: [streamMap["Technology (ET/BST)"]] },
            { name: "A/L Information & Communication Technology (ICT)", levelId: alLevel._id, streamIds: [streamMap["Information Technology (ICT)"], streamMap["Physical Science (Maths)"]] },
            { name: "Political Science", levelId: alLevel._id, streamIds: [streamMap["Arts"]] },
            { name: "Buddhist Civilization", levelId: alLevel._id, streamIds: [streamMap["Arts"]] }
        ];

        const subjectDocMap = {};
        for (const sub of initialSubjects) {
            let found = await Subject.findOne({ name: sub.name, levelId: sub.levelId });
            if (!found) {
                found = await Subject.create(sub);
            }
            subjectDocMap[sub.name] = found._id;
        }

        // 6. Seed Sample Past Papers & Marking Schemes (2024, 2023, 2022)
        const pdfCount = await PDF.countDocuments();
        if (pdfCount === 0) {
            console.log("📄 Seeding sample Past Paper PDFs and Marking Schemes...");
            const samplePDFs = [
                // O/L Maths
                {
                    title: "2024 - Mathematics (O/L) Paper 1 & 2",
                    year: 2024,
                    part: "Full Paper",
                    medium: "Sinhala",
                    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    fileSize: "2.4 MB",
                    subjectId: subjectDocMap["Mathematics"],
                    typeId: ppType._id
                },
                {
                    title: "2024 - Mathematics (O/L) Marking Scheme",
                    year: 2024,
                    part: "Full Scheme",
                    medium: "Sinhala",
                    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    fileSize: "1.8 MB",
                    subjectId: subjectDocMap["Mathematics"],
                    typeId: msType._id
                },
                {
                    title: "2023 - Mathematics (O/L) English Medium Paper",
                    year: 2023,
                    part: "Full Paper",
                    medium: "English",
                    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    fileSize: "2.1 MB",
                    subjectId: subjectDocMap["Mathematics"],
                    typeId: ppType._id
                },
                // O/L Science
                {
                    title: "2024 - Science (O/L) Paper 1 & 2",
                    year: 2024,
                    part: "Full Paper",
                    medium: "Sinhala",
                    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    fileSize: "3.2 MB",
                    subjectId: subjectDocMap["Science"],
                    typeId: ppType._id
                },
                {
                    title: "2024 - Science (O/L) Marking Scheme",
                    year: 2024,
                    part: "Full Scheme",
                    medium: "Sinhala",
                    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    fileSize: "1.5 MB",
                    subjectId: subjectDocMap["Science"],
                    typeId: msType._id
                },
                // A/L Combined Maths
                {
                    title: "2024 - Combined Mathematics (A/L) Paper 1",
                    year: 2024,
                    part: "Paper 1",
                    medium: "Sinhala",
                    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    fileSize: "1.9 MB",
                    subjectId: subjectDocMap["Combined Mathematics"],
                    typeId: ppType._id
                },
                {
                    title: "2024 - Combined Mathematics (A/L) Paper 2",
                    year: 2024,
                    part: "Paper 2",
                    medium: "Sinhala",
                    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    fileSize: "2.2 MB",
                    subjectId: subjectDocMap["Combined Mathematics"],
                    typeId: ppType._id
                },
                {
                    title: "2024 - Combined Mathematics (A/L) Marking Scheme",
                    year: 2024,
                    part: "Full Scheme",
                    medium: "Sinhala",
                    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    fileSize: "3.5 MB",
                    subjectId: subjectDocMap["Combined Mathematics"],
                    typeId: msType._id
                },
                // A/L Physics
                {
                    title: "2024 - Physics (A/L) Paper 1 & 2",
                    year: 2024,
                    part: "Full Paper",
                    medium: "English",
                    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    fileSize: "2.8 MB",
                    subjectId: subjectDocMap["Physics"],
                    typeId: ppType._id
                },
                {
                    title: "2024 - Physics (A/L) Marking Scheme",
                    year: 2024,
                    part: "Full Scheme",
                    medium: "English",
                    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    fileSize: "2.1 MB",
                    subjectId: subjectDocMap["Physics"],
                    typeId: msType._id
                },
                // A/L Accounting
                {
                    title: "2024 - Accounting (A/L) Paper 1 & 2",
                    year: 2024,
                    part: "Full Paper",
                    medium: "Sinhala",
                    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    fileSize: "1.7 MB",
                    subjectId: subjectDocMap["Accounting"],
                    typeId: ppType._id
                }
            ];

            await PDF.insertMany(samplePDFs);
            console.log("✅ Seeded sample past paper PDFs into MongoDB.");
        }

        console.log("🎉 Database seeding check completed successfully.");
    } catch (error) {
        console.error("⚠️ Error seeding database:", error);
    }
};
