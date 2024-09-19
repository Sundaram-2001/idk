const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const prisma = new PrismaClient();

const getAllMails = async () => {
    try {
        const emails = await prisma.Emails.findMany();
        return emails;
    } catch (error) {
        console.error("Error fetching emails:", error);
        throw error;
    }
};

const addEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const new_mail = await prisma.Emails.create({
            data: {
                email: email
            }
        });
        res.status(200).send({ new_mail });
    } catch (error) {
        console.error("Error adding email:", error);
        throw error;
    }
};

// Fetch daily LeetCode question
async function fetchDailyLeetCodeQuestion() {
    const query = `
      query questionOfToday {
        activeDailyCodingChallengeQuestion {
          date
          userStatus
          link
          question {
            acRate
            difficulty
            freqBar
            frontendQuestionId: questionFrontendId
            isFavor
            paidOnly: isPaidOnly
            status
            title
            titleSlug
            hasVideoSolution
            hasSolution
            topicTags {
              name
              id
              slug
            }
          }
        }
      }
    `;
  
    try {
      const response = await axios({
        url: 'https://leetcode.com/graphql',
        method: 'post',
        data: {
          query: query
        },
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
  
      console.log('LeetCode API Response:', JSON.stringify(response.data, null, 2));
  
      const questionData = response.data.data.activeDailyCodingChallengeQuestion;
      
      if (!questionData || !questionData.link) {
        console.error('Invalid or missing link in LeetCode response');
        throw new Error('Invalid question data received');
      }
  
      // Construct the full URL if it's a relative path
      const fullLink = questionData.link.startsWith('http') 
        ? questionData.link 
        : `https://leetcode.com${questionData.link}`;
  
      return {
        ...questionData,
        link: fullLink
      };
  
    } catch (error) {
      console.error('Error fetching LeetCode question:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
module.exports = { getAllMails, addEmail, fetchDailyLeetCodeQuestion };