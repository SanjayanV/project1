import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mic, User, Settings, LogOut } from "lucide-react";

// Product Data with Categories (fixed prices to be consistent numbers)
const products = [
  { id: 1, name: "Fresh Carrots", tamilName: "கேரட்" , weight: "1kg", category: "Vegetables" , price: "100", image: "https://www.bigbasket.com/media/uploads/p/xxl/10000070_16-fresho-carrot-orange.jpg" },
  { id: 2, name: "Organic Tomatoes", tamilName: "தக்காளி", category: "Vegetables" , weight: "1kg", price: "199", image: "https://img.freepik.com/free-photo/top-view-fresh-red-tomatoes-inside-basket_140725-57742.jpg" },
  { id: 3, name: "Green Apples", tamilName:"பச்சை ஆப்பிள்கள்" , category: "Fruits" , weight: "1kg", price: "250", image: "https://st3.depositphotos.com/30407070/36782/i/450/depositphotos_367825706-stock-photo-green-apples-plate-brown-wooden.jpg" },
  { id: 4, name: "Bananas", weight: "1kg", tamilName:"வாழைப்பழம்" , category: "Fruits" ,  price: "50", image: "https://thumbs.dreamstime.com/b/bunch-bananas-plate-great-creative-professional-projects-356584793.jpg" },
  { id: 5, name: "Almond Seeds",  weight: "1kg", tamilName:"பாதாம் விதைகள்" , category: "Seeds" , price: "500", image: "https://cbx-prod.b-cdn.net/COLOURBOX47480356.jpg?width=800&height=800&quality=70" },
  { id: 6, name: "Fresh Milk",tamilName:"பால்" , category: "Dairy Products" , weight: "1kg", price: "40", image: "https://img.freepik.com/free-photo/fresh-milk-bottle-glass_1150-17631.jpg" },
  { id: 7, name: "Cheese",tamilName:"சீஸ்" , category: "Dairy Products" , weight: "1kg", price: "180", image: "https://www.allrecipes.com/thmb/PwgOsAXFGvpolr0hUiB7pVlS75k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Yellow-vs-White-Cheddar-Cheese-4x3-de76c824c4814aa8a5d52569d572713d.png" },
  { id: 8, name: "Organic Fertilizer",tamilName:"ஆர்கானிக் உரம்" , category: "Fertilizers" , weight: "1kg", price: "1200", image: "https://rukminim2.flixcart.com/image/850/1000/kr0ynbk0/soil-manure/z/j/c/5-nutri-rich-organic-fertilizer-pack-of-1-5-kg-agriboost-original-imag4wkknzezzzcc.jpeg?q=90&crop=false" },
  { id: 9, name: "Strawberries", tamilName:"ஸ்ட்ராபெர்ரி" , category: "Fruits" ,weight: "1kg", price: "249", image: "https://thumbs.dreamstime.com/b/strawberries-wooden-bowl-brown-table-closeup-red-ripe-berries-fresh-juicy-strawberry-background-selective-focus-209011618.jpg" },
  { id: 10, name: "Cabbage",tamilName:"முட்டைக்கோஸ்" , category: "Dairy Products" , weight: "1kg", price: "120", image: "https://static.vecteezy.com/system/resources/previews/040/995/503/non_2x/ai-generated-cabbage-in-basket-on-wooden-table-photo.jpg" },
  { id: 11, name: "Sunflower Seeds",tamilName:"சூரியகாந்தி விதைகள்" , category: "Seeds" , weight: "1kg", price: "80", image: "https://m.media-amazon.com/images/I/71yz2Pi2SBL._AC_UF1000,1000_QL80_.jpg" },
  { id: 12, name: "Butter", weight: "1kg", tamilName:"வெண்ணெய்" , category: "Dairy Products" , price: "99", image: "https://5.imimg.com/data5/FN/OM/MY-23458232/fresh-butter-500x500.jpg" },
    { id: 13, name: "Black Grapes", tamilName:"கருப்பு திராட்சை" , category: "Fruits" , weight: "1kg", price: "220", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPXqZQuBk0ljkT6dYMb5SzPVVihG0zlx7h1A&s" },
    { id: 14, name: "Walnut Seeds", tamilName:"வால்நட் விதைகள்" , category: "Seeds" , weight: "1kg", price: "600", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl1uFxggfeCevz0KDDxI0yRFtimetZlW8gBg&s" },
    { id: 15, name: "Whole Wheat Bread", tamilName:"முழு கோதுமை ரொட்டி" , category: "Dairy Products" , weight: "1kg", price: "80", image: "https://www.theredheadbaker.com/wp-content/uploads/2020/10/white-whole-wheat-bread-featured.jpg" },
    { id: 16, name: "Broccoli", tamilName:"ப்ரோக்கோலி" , category: "Vegetables" , weight: "1kg", price: "150", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgEtPkkoSROnlZhTWPkKfoiWjz438Ymptu4A&s" },
    { id: 17, name: "Cashew Nuts", tamilName:"முந்திரி" , category: "Seeds" , weight: "1kg", price: "750", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNSFJxH-ALmXYpmgoNJQxMKiprNNiqkdpcrA&s" },
    { id: 18, name: "Soy Milk", tamilName:"சோயா பால்" , category: "Dairy Products" , weight: "1kg", price: "120", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5WhsVF0dPYb_uCLSQBM9h5YV28R6rx1BUgQ&s" },
    { id: 19, name: "Paneer", tamilName:"பன்னீர்" , category: "Dairy Products" , weight: "1kg", price: "180", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE0FvAhZ2WHLHm2ct5sSG4qWz3zDnFZb68Dg&s" },
    { id: 20, name: "Oranges", tamilName:"ஆரஞ்சு" , category: "Fruits" , weight: "1kg", price: "200", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK_H77qrveJBGq8lTx2HGqe_CLmL9mnml_Uw&s" },
    { id: 21, name: "Peanut Butter", tamilName:"வேர்க்கடலை வெண்ணெய்" , category: "Dairy Products" , weight: "1kg", price: "350", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkzcqsa9CEKuTEKeQACf23-NFIsd5LCWg9zA&s" },
    { id: 23, name: "Chia Seeds",  tamilName:"சியா விதைகள்" , category: "Seeds" , weight: "1kg", price: "300", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvZjGXEwMOZGqAA8Hci-B0z7bAoUyH-DiABg&s" },
    { id: 24, name: "Pistachios", tamilName:"பிஸ்தா" , category: "Seeds" , weight: "1kg", price: "900", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRllzjvljJNOZtXHWCf4e0Pcc9Lgh0vEq30cA&s" },
    { id: 25, name: "Pumpkin Seeds", tamilName:"பூசணி விதைகள்" , category: "Seeds" , weight: "1kg", price: "450", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf2eV4W2kvtv0U0eKWRUak0R35oTbMrsI0OQ&s" },
    { id: 26, name: "Brown Rice", tamilName:"பழுப்பு அரிசி" , category: "Seeds" , weight: "1kg", price: "110", image: "https://images.onlymyhealth.com/imported/images/2024/June/26_Jun_2024/mn-brown-rice.jpg" },
    { id: 27, name: "Quinoa", tamilName:"குயினோவா" , category: "Seeds" , weight: "1kg", price: "500", image: "https://imgs.littleextralove.com/wp-content/uploads/2022/11/quinoa-for-hair-feat.jpg" },
    { id: 28, name: "Avocado", tamilName:"வெண்ணெய் பழம்" , category: "Fruits" , weight: "1kg", price: "400", image: "https://blog.lexmed.com/images/librariesprovider80/blog-post-featured-images/avocadosea5afd66b7296e538033ff0000e6f23e.jpg?sfvrsn=a273930b_0" },
    { id: 29, name: "Mushrooms", tamilName:"காளான்" , category: "Vegetables" , weight: "1kg", price: "220", image: "https://www.jiomart.com/images/product/original/590000245/button-mushroom-200-g-product-images-o590000245-p590000245-0-202408070949.jpg?im=Resize=(1000,1000)" },
    { id: 30, name: "Spinach", tamilName:"கீரை" , category: "Vegetables" , weight: "1kg", price: "80", image: "https://www.trustbasket.com/cdn/shop/articles/Spinach.webp?v=1686909241" },
    { id: 32, name: "Blueberries", tamilName:"ப்ளூபெர்ரி" , category: "Fruits" , weight: "1kg", price: "280", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkaRYA3YtnHmmmLs_RfYtReyNjpHdfPZ29Hw&s" },
    { id: 33, name: "Raspberries", tamilName:"ராஸ்பெர்ரி" , category: "Fruits" , weight: "1kg", price: "320", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReWPuQA-aaHdlRrC6z6wGMKXJvKGxoGTH8Yw&s" },
    { id: 34, name: "Coconut Oil", tamilName:"தேங்காய் எண்ணெய்" , category: "Herbs" , weight: "1kg", price: "350", image: "https://kumarmetal.com/wp-content/uploads/2021/08/setting-up-virgin-coconut-oil-plant.jpg" },
    { id: 35, name: "Olive Oil", tamilName:"ஆலிவ் எண்ணெய்" , category: "Herbs" , weight: "1kg", price: "500", image: "https://www.tatasimplybetter.com/cdn/shop/files/DSC09606_2048x2048.jpg?v=1734608321" },
    { id: 36, name: "Flaxseeds", tamilName:"ஆளி விதைகள்" , category: "Seeds" , weight: "1kg", price: "180", image: "https://domf5oio6qrcr.cloudfront.net/medialibrary/5961/cba8bd1b-be70-4f55-8818-9caf1b3df3de.jpg" },
    { id: 37, name: "Honey", tamilName:"தேன்" , category: "Herbs" , weight: "1kg", price: "300", image: "https://5.imimg.com/data5/UD/MB/MY-42635865/natural-honey-500x500.jpg" },
    { id: 38, name: "Almond Butter", tamilName:"பாதாம் வெண்ணெய்" , category: "Dairy Products" , weight: "1kg", price: "450", image: "https://www.inspiredtaste.net/wp-content/uploads/2020/06/Homemade-Almond-Butter-Recipe-1200.jpg" },
    { id: 40, name: "Zucchini", tamilName:"சீமை சுரைக்காய்" , category: "Vegetables" , weight: "1kg", price: "140", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNZ2hJYtaYVZYq1AdkzdUAK3kPZ8hUjFkz7A&s" },
    { id: 41, name: "Mangoes", tamilName:"மாங்காய்" , category: "Fruits" , weight: "1kg", price: "250", image: "https://deyga.in/cdn/shop/articles/mangoes-cover-1.jpg?v=1617118328" },
    { id: 42, name: "Lettuce", tamilName:"லெட்டூஸ்" , category: "Vegetables" , weight: "1kg", price: "90", image: "https://cdn.britannica.com/77/170677-050-F7333D51/lettuce.jpg" },
    { id: 43, name: "Eggs", tamilName:"முட்டை" , category: "Dairy Products" , weight: "1kg", price: "160", image: "https://cdn.britannica.com/94/151894-050-F72A5317/Brown-eggs.jpg" },
    { id: 44, name: "Cinnamon",  tamilName:"இலவங்கப்பட்டை" , category: "Herbs" , weight: "1kg", price: "200", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsqlvKSkdy63JB_1zan4kFnkQkTYU0zQed2w&s" },
    { id: 45, name: "Black Pepper", tamilName:"கருப்பு மிளகு" , category: "Herbs" , weight: "1kg", price: "220", image: "https://ashokchakranursery.com/wp-content/uploads/2024/12/blackky.webp" },
    { id: 46, name: "Turmeric", tamilName:"மஞ்சள்" , category: "Herbs" , weight: "1kg", price: "150", image: "https://m.media-amazon.com/images/I/6143Jp46RpL.jpg" },
    { id: 47, name: "Cloves", tamilName:"கிராம்பு" , category: "Herbs" , weight: "1kg", price: "180", image: "https://rukminim2.flixcart.com/image/850/1000/xif0q/plant-seed/q/o/1/50-rxi-16-cloves-lavanga-seeds-50-seeds-vibex-original-imaggnksk72yapmb.jpeg?q=20&crop=false" },
    { id: 48, name: "Cardamom", tamilName:"ஏலக்காய்" , category: "Herbs" , weight: "1kg", price: "450", image: "https://mangalorespice.com/cdn/shop/products/SP_08-02.jpg?v=1734783515&width=1445" },
    { id: 49, name: "Bay Leaves", tamilName:"வளைகுடா இலைகள்" , category: "Herbs" , weight: "1kg", price: "100", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtgEThIf3xCwbmi9Zp-8TShveI4Tu4yUwtLw&s" },
    { id: 50, name: "Coriander Powder", tamilName:"கொத்தமல்லி பொடி" , category: "Herbs" , weight: "1kg", price: "120", image: "https://c.ndtvimg.com/2023-03/p4igk5po_dry-coriander-leaves_625x300_10_March_23.jpg?im=FaceCrop,algorithm=dnn,width=1200,height=675" },
    { id: 51, name: "Fenugreek Seeds", tamilName:"வெந்தய விதைகள்" , category: "Seeds" , weight: "1kg", price: "130", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIxYjphT6AhMLmiUV85nNx_0urQI4VvNO9iw&s" },
    { id: 52, name: "Basil", tamilName:"துளசி" , category: "Herbs" , weight: "1kg", price: "160", image: "https://aanmc.org/wp-content/uploads/2021/08/987-1024x681.jpg" },
    { id: 53, name: "Rosemary", tamilName:"ரோஸ்மேரி" , category: "Herbs" , weight: "1kg", price: "180", image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/02/Rosemary-sprig-7d96e10.jpg" },
    { id: 54, name: "Thyme", tamilName:"தைம்" , category: "Herbs" , weight: "1kg", price: "200", image: "https://www.greendna.in/cdn/shop/products/ThymeLeaves1_1076x.jpg?v=1586944767" },
    { id: 55, name: "Parsley", tamilName:"வோக்கோசு" , category: "Herbs" , weight: "1kg", price: "140", image: "https://www.greendna.in/cdn/shop/products/parsley_600x.jpg?v=1582188747" },
    { id: 56, name: "Papaya",  tamilName:"பப்பாளி" , category: "Fruits" , weight: "1kg", price: "180", image: "https://www.dreamfoodscaribe.com/wp-content/uploads/2024/07/papaya-fruit.webp" },
    { id: 57, name: "Cucumber", tamilName:"வெள்ளரிக்காய்" , category: "Vegetables" , weight: "1kg", price: "90", image: "https://www.bigbasket.com/media/uploads/p/xl/10000102_19-fresho-cucumber.jpg" },
    { id: 58, name: "Watermelon", tamilName:"தர்பூசணி" , category: "Fruits" , weight: "1kg", price: "300", image: "https://hips.hearstapps.com/hmg-prod/images/fresh-ripe-watermelon-slices-on-wooden-table-royalty-free-image-1723738944.jpg" },
    { id: 59, name: "Dragon Fruit", tamilName:"டிராகன் பழம்" , category: "Fruits" , weight: "1kg", price: "450", image: "https://media.post.rvohealth.io/wp-content/uploads/2024/01/A-pink-pitahaya-cut-it-in-half-Dragon-Fruit-header.jpg" },
    { id: 60, name: "Pineapple", tamilName:"அன்னாசிப்பழம்" , category: "Fruits" , weight: "1kg", price: "230", image: "https://organicmandya.com/cdn/shop/files/Pineapple.jpg?v=1721375225&width=1500" },
    { id: 61, name: "Ginger", tamilName:"இஞ்சி" , category: "Herbs" , weight: "1kg", price: "130", image: "https://www.garnierusa.com/-/media/project/loreal/brand-sites/garnier/usa/us/articles_new/strengthen-fragile-hair-with-ginger/garnier_article-header_ginger.jpg?rev=07e043606da3401aa15837849d8fef41&h=496&w=890&la=en&hash=C756272A42D8E095BF63E44BA3DE2897" },
    { id: 62, name: "Garlic", tamilName:"பூண்டு" , category: "Herbs" , weight: "1kg", price: "120", image: "https://www.jiomart.com/images/product/original/590003532/indian-garlic-200-g-product-images-o590003532-p590003532-0-202408070949.jpg?im=Resize=(1000,1000)" },
    { id: 63, name: "Beetroot", tamilName:"பீட்ரூட்" , category: "Vegetables" , weight: "1kg", price: "140", image: "https://www.fitterfly.com/blog/wp-content/uploads/2022/09/Is-Beetroot-Good-for-Diabetes-2.webp" },
    { id: 64, name: "Celery", tamilName:"செலரி" , category: "Herbs" , weight: "1kg", price: "160", image: "https://cdn.britannica.com/68/143768-050-108B71EC/Celery.jpg" },
    { id: 65, name: "Brussels Sprouts", tamilName:"புருசெல்ஸ் முளைகள்" , category: "Herbs" ,  weight: "1kg", price: "250", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3RPU-SU7J8vgl7dSEkLGCRCjMXTH0312AjQ&s" }  
];

const ProductSelection = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [billList, setBillList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [disputes, setDisputes] = useState([]);
  const [newDispute, setNewDispute] = useState("");
  const [language, setLanguage] = useState("English");
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [farmerInfo, setFarmerInfo] = useState({ name: "John Doe", email: "john@example.com" });

  // Voice Recognition Setup
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === "English" ? "en-US" : "ta-IN";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const product = products.find((p) =>
        p.name.toLowerCase().includes(transcript) ||
        (language === "Tamil" && p.tamilName.toLowerCase().includes(transcript))
      );
      if (product) toggleSelection(product);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    if (isListening) recognition.start();
    return () => recognition.stop();
  }, [isListening, language]);

  // Product Selection Logic
  const toggleSelection = (product) => {
    setSelectedProducts((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const addToBill = () => {
    setBillList((prev) => {
      let updatedBill = [...prev];
      selectedProducts.forEach((product) => {
        const existingIndex = updatedBill.findIndex((item) => item.id === product.id);
        if (existingIndex !== -1) {
          updatedBill[existingIndex].qty += 1;
          updatedBill[existingIndex].finalPrice = updatedBill[existingIndex].qty * Number(product.price);
        } else {
          updatedBill.push({ ...product, qty: 1, finalPrice: Number(product.price) });
        }
      });
      return updatedBill;
    });
    setSelectedProducts([]);
  };

  const updateQuantity = (id, newQty) => {
    setBillList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, newQty), finalPrice: Math.max(1, newQty) * Number(item.price) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setBillList((prev) => prev.filter((item) => item.id !== id));
  };

  const addDispute = () => {
    if (newDispute.trim()) {
      setDisputes((prev) => [...prev, newDispute]);
      setNewDispute("");
    }
  };

  const filteredProducts = products.filter((product) =>
    language === "English"
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
      : product.tamilName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categorizedBill = {
    Vegetables: billList.filter((item) => item.category === "Vegetables"),
    Fruits: billList.filter((item) => item.category === "Fruits"),
    Seeds: billList.filter((item) => item.category === "Seeds"),
    Fertilizers: billList.filter((item) => item.category === "Fertilizers"),
    Herbs: billList.filter((item) => item.category === "Herbs"),
    "Dairy Products": billList.filter((item) => item.category === "Dairy Products"), // Fixed key
  };

  const totalAmount = billList.reduce((sum, item) => sum + Number(item.finalPrice), 0);

  // Animation Variants
  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 } }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div
      className={`min-h-screen p-6 font-sans ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 text-gray-800"}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <motion.header
        className="flex justify-between items-center mb-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg"
        variants={containerVariants}
      >
        <div className="flex items-center space-x-4">
          <motion.img
            src="https://i.pinimg.com/736x/a8/f4/6a/a8f46ad882c293af8c3fe011ce13bbb0.jpg"
            alt="Logo"
            className="w-12 h-12 rounded-full border-2 border-teal-200"
            whileHover={{ scale: 1.1, rotate: 360 }}
          />
          <h1 className="text-2xl font-bold text-teal-800">
            {language === "English" ? "Farmer's Market" : "விவசாய சந்தை"}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-teal-100 rounded-full hover:bg-teal-200"
            whileHover={{ scale: 1.1 }}
          >
            <Settings className="w-6 h-6 text-teal-800" />
          </motion.button>
          <motion.button
            className="p-2 bg-teal-100 rounded-full hover:bg-teal-200"
            whileHover={{ scale: 1.1 }}
          >
            <User className="w-6 h-6 text-teal-800" />
          </motion.button>
          <motion.button
            className="p-2 bg-red-100 rounded-full hover:bg-red-200"
            whileHover={{ scale: 1.1 }}
          >
            <LogOut className="w-6 h-6 text-red-800" />
          </motion.button>
        </div>
      </motion.header>

      {/* Settings Dropdown */}
      {showSettings && (
        <motion.div
          className="absolute top-20 right-6 p-4 bg-white rounded-2xl shadow-xl z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-teal-800">{farmerInfo.name}</p>
              <p className="text-sm text-gray-600">{farmerInfo.email}</p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 rounded-lg border border-teal-200"
            >
              <option value="English">English</option>
              <option value="Tamil">தமிழ்</option>
            </select>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div className="max-w-7xl mx-auto" variants={containerVariants}>
        {/* Search and Voice Selection */}
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            placeholder={language === "English" ? "Search products..." : "தயாரிப்புகளைத் தேடு..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-teal-200 bg-white/90 focus:ring-2 focus:ring-teal-400 focus:outline-none"
          />
          <motion.button
            onClick={() => setIsListening(!isListening)}
            className={`p-3 rounded-full ${isListening ? "bg-red-500" : "bg-teal-500"} text-white`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Product Grid */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8" variants={containerVariants}>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              onClick={() => toggleSelection(product)}
              className={`p-4 bg-white/90 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer border-2 ${
                selectedProducts.some((p) => p.id === product.id) ? "border-teal-500" : "border-transparent"
              }`}
            >
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
              <h3 className="text-lg font-semibold text-teal-800">
                {language === "English" ? product.name : product.tamilName}
              </h3>
              <p className="text-sm text-gray-600">{product.weight}</p>
              <p className="text-teal-700 font-medium">₹{product.price}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Add to Bill Button */}
        {selectedProducts.length > 0 && (
          <motion.button
            onClick={addToBill}
            className="w-full max-w-xs mx-auto block p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-md"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {language === "English" ? "Add to Bill" : "பில் சேர்"}
          </motion.button>
        )}

        {/* Bill Section */}
        {billList.length > 0 && (
          <motion.div className="mt-8 p-6 bg-white/90 rounded-2xl shadow-lg" variants={containerVariants}>
            <h2 className="text-2xl font-bold text-teal-800 mb-4">
              {language === "English" ? "Your Bill" : "உங்கள் பில்"}
            </h2>
            {["Vegetables", "Fruits", "Seeds", "Dairy Products", "Herbs", "Fertilizers"].map((category) => (
              categorizedBill[category].length > 0 && (
                <div key={category} className="mb-6">
                  <h3 className="text-xl font-semibold text-teal-700">
                    {language === "English" ? category : {
                      Vegetables: "காய்கறிகள்",
                      Fruits: "பழங்கள்",
                      Seeds: "விதைகள்",
                      "Dairy Products": "பால் பொருட்கள்",
                      Fertilizers: "உரங்கள்",
                      Herbs: "மூலிகைகள்"
                    }[category]}
                  </h3>
                  {categorizedBill[category].map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center justify-between p-4 border-b border-teal-100"
                      variants={itemVariants}
                    >
                      <div className="flex items-center space-x-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg" />
                        <div>
                          <p className="font-medium text-teal-800">
                            {language === "English" ? item.name : item.tamilName}
                          </p>
                          <p className="text-sm text-gray-600">{item.weight}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 p-2 rounded-lg border border-teal-200 text-center"
                          min="1"
                        />
                        <p className="text-teal-700 font-medium">₹{item.finalPrice}</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  <p className="text-right font-semibold text-teal-800 mt-2">
                    {language === "English" ? "Subtotal" : "துணை மொத்தம்"}: ₹{categorizedBill[category].reduce((sum, item) => sum + Number(item.finalPrice), 0)}
                  </p>
                </div>
              )
            ))}
            <p className="text-2xl font-bold text-teal-800 text-right">
              {language === "English" ? "Total" : "மொத்தம்"}: ₹{totalAmount}
            </p>
          </motion.div>
        )}

        {/* Additional Features */}
        <motion.div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants}>
          {/* Disputes */}
          <div className="p-6 bg-white/90 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-teal-800 mb-4">
              {language === "English" ? "Dispute Section" : "புகார் பிரிவு"}
            </h2>
            <input
              type="text"
              value={newDispute}
              onChange={(e) => setNewDispute(e.target.value)}
              placeholder={language === "English" ? "Enter your query..." : "உங்கள் கேள்வியை உள்ளிடவும்..."}
              className="w-full p-3 rounded-lg border border-teal-200 mb-3"
            />
            <button
              onClick={addDispute}
              className="w-full p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              {language === "English" ? "Submit" : "சமர்ப்பி"}
            </button>
            {disputes.map((dispute, index) => (
              <p key={index} className="mt-2 text-teal-700">{dispute}</p>
            ))}
          </div>

          {/* Weather Widget (Placeholder) */}
          <div className="p-6 bg-white/90 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-teal-800 mb-4">
              {language === "English" ? "Weather Info" : "வானிலை தகவல்"}
            </h2>
            <p className="text-teal-700">
              {language === "English" ? "Weather data coming soon..." : "வானிலை தரவு விரைவில் வரும்..."}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProductSelection;