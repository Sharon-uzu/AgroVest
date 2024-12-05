import React, { useState } from 'react';
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";

// Define the Faq array before using it
const Faqs = [
  {
    id: 1,
    question: 'What is Agrovest and what does it aim to achieve?',
    answer: 'Agrovest is an agriculture-focused platform designed to increase food security by promoting sustainable farming practices, reducing the use of chemicals in agriculture, and connecting farmers directly with buyers. Its mission is to engage youth in agriculture and foster a healthier, more sustainable food system.',
  },
  {
    id: 2,
    question: 'How does Agrovest support farmers?',
    answer: 'Agrovest provides farmers and producers with access to agricultural technologies, market linkages, and educational resources. This support helps improve productivity, promote sustainable practices, and directly connect farmers and producers with buyers.',
  },
  {
    id: 3,
    question: 'How does the Agrovest platform connect farmers and buyers?',
    answer: 'The Agrovest platform is designed to eliminate the need for middlemen by directly connecting farmers and producers with buyers. Through the website, farmers and producers can showcase their products, negotiate prices, and sell directly to consumers or businesses, ensuring better prices for both parties and reducing the costs associated with intermediaries.',
  },
  {
    id: 4,
    question: 'How can Agrovest help reduce chemicals in farming?',
    answer: 'Agrovest promotes sustainable farming practices that minimize the need for harmful chemical inputs. By offering training on organic farming techniques and facilitating access to eco-friendly inputs, the platform helps farmers reduce their reliance on chemical fertilizers and pesticides.',
  },
  {
    id: 5,
    question: 'What initiatives does Agrovest have to engage youth in agriculture?',
    answer: 'Agrovest runs various campaigns to inspire young people to get involved in agriculture and livestock farming. These include educational content on crop and livestock production, and highlighting the business potential of agriculture through online platforms.',
  },
  {
    id: 6,
    question: 'What products are involved with Agrovest?',
    answer: 'Agrovest supports a diverse range of agricultural products including crops like processed cassava (garri &fufu)  as well as livestock and fisheries such as snail, catfish, and chicken.',
  },
  {
    id: 7,
    question: 'When is Agrovest launching?',
    answer: 'Agrovest is set to launch Soon. Stay tuned for updates and announcements regarding the official launch date!',
  },
];

const Faq = () => {
  // Initialize state to track the visibility of answers for each FAQ item
  const [open, setOpen] = useState(Array(Faqs.length).fill(false));

  const toggleAnswer = (index) => {
    setOpen(open.map((item, i) => (i === index ? !item : item)));
  };

  return (
    <div className='faqs' id='faq'>
      <h1>Have any Question?</h1>
      <div className='w-r'>
        {Faqs.map((item, index) => (
          <div className="ques" key={item.id}>
            <div onClick={() => toggleAnswer(index)}>
              {open[index] ? (
                <IoIosArrowDropup className='arr-icon' />
              ) : (
                <IoIosArrowDropdown className='arr-icon' />
              )}
            </div>
            <div>
              <h4>{item.question}</h4>
              {open[index] && <p>{item.answer}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
