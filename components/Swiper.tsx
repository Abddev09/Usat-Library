 "use client"

import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Info, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useMediaQuery } from "@/lib/hooks/useMediaQuery"
import { getFullImageUrl } from "@/lib/utils"
import { getBooks } from "@/lib/api"
import { useTranslation } from "react-i18next"
import Image from "next/image"
import type { BookData } from "@/types/index"
import { motion } from "framer-motion"

// Swiper stillarini import qilamiz
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

// Shadcn/ui komponentlarini import qilamiz
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import MagnetButton from "./Magnet"

interface SwipperProps {
  initialBooks?: BookData[]
}

// Swiper uchun skeleton komponenti
const SwiperCardSkeleton = () => (
  <Card className="group hover:shadow-xl transition-all duration-300 border border-[#21466D]/10 rounded-xl h-full flex flex-col justify-between animate-pulse">
    <CardContent className="p-4 flex-grow flex flex-col max-sm:p-3 max-xs:p-2">
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <div className="w-full h-[350px] bg-gray-200 max-lg:h-[300px] max-md:h-[280px] max-sm:h-[250px] max-xs:h-[220px] rounded-lg"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </CardContent>
    <CardFooter className="p-4 pt-0 max-sm:p-3 max-xs:p-2">
      <div className="w-full h-10 bg-gray-200 rounded"></div>
    </CardFooter>
  </Card>
)

// Title skeleton component
const TitleSkeleton = () => (
  <div className="container mx-auto px-4 py-6 text-start max-w-[1800px]">
    <div className="h-12 bg-gray-200 rounded w-64 animate-pulse max-sm:h-10 max-sm:w-48"></div>
  </div>
)

export default function Swipper({ initialBooks }: SwipperProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1023px)")
  const [books, setBooks] = useState<BookData[]>(initialBooks || [])
  const [loading, setLoading] = useState(!initialBooks)

  useEffect(() => {
    const fetchData = async () => {
      if (initialBooks && initialBooks.length > 0) {
        setBooks(initialBooks)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const booksResponse = (await getBooks()) as any
        const parsedBooks: BookData[] = Array.isArray(booksResponse.data) 
          ? booksResponse.data 
          : [booksResponse.data]
        setBooks(parsedBooks)
      } catch (error) {
        console.error("Ma'lumotlarni olishda xatolik:", error)
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [initialBooks, t])

  const filteredBooks: BookData[] = books.filter((book) => {
    const createdAt = new Date(book.Book.createdAt)
    const fiveMonthsAgo = new Date()
    fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5)
    return createdAt > fiveMonthsAgo
  })

  // Kitoblar sonini loop uchun ko'paytiramiz
  const duplicatedBooks = filteredBooks.length > 0 
    ? [...filteredBooks, ...filteredBooks, ...filteredBooks]
    : []

  const handleCardClick = (bookId: string) => {
    router.push(`/book/${bookId}`)
  }



  const isTokenyes = (callback: () => void) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.warning(t("common.loginRequired"))
      router.push("/login")
    } else {
      callback()
    }
  }

  const getSkeletonCount = () => {
    if (isMobile) return 1
    if (isTablet) return 2
    return 4
  }

  return (
    <div className="w-full mx-auto px-4 py-2 max-w-[1920px]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full mx-auto max-w-[1800px]"
      >
        {/* Title with loading state */}
        {loading ? (
          <TitleSkeleton />
        ) : (
          <div className="container mx-auto px-4 py-6 text-start max-w-[1800px]">
            <h1 className="text-[38px] font-[700] text-[#21466D] max-lg:text-[32px] max-md:text-[28px] max-sm:text-[24px] max-xs:text-[20px]">
              {t("common.newBooks")}
            </h1>
          </div>
        )}

        <div className="relative px-4">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            modules={[Autoplay, Pagination]}
            loop={duplicatedBooks.length > 0}
            className="book-swiper"
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 15,
              },
              480: {
                slidesPerView: 1,
                spaceBetween: 15,
              },
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 1.5,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 2.5,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 3.5,
                spaceBetween: 24,
              },
              1536: {
                slidesPerView: 3.5,
                spaceBetween: 28,
              }
            }}
          >
            {loading
              ? Array.from({ length: getSkeletonCount() }).map((_, index) => (
                  <SwiperSlide key={`skeleton-${index}`}>
                    <SwiperCardSkeleton />
                  </SwiperSlide>
                ))
              : duplicatedBooks.map((book, index) => {
                  const isNew = true
                  return (
                    <SwiperSlide key={`${book.Book.id}-${index}`}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="h-full"
                      >
                        <Card
                          onClick={() => isTokenyes(() => handleCardClick(book.Book.id))}
                          className="group hover:shadow-2xl transition-all duration-300 border border-[#21466D]/10 rounded-xl cursor-pointer hover:border-[#21466D]/30 h-full flex flex-col justify-between hover:scale-[1.02] transform"
                        >
                          <CardContent className="p-4 flex-grow flex flex-col max-sm:p-3 max-xs:p-2">
                            <div className="relative mb-4 overflow-hidden rounded-lg transition-shadow duration-300">
                              <Image
                                src={
                                  getFullImageUrl(book.Book.image?.url) ||
                                  "/placeholder.svg?height=350&width=250&query=book cover"
                                }
                                alt={book.Book.name}
                                width={250}
                                height={350}


                                className="w-full h-[350px] object-cover max-lg:h-[300px] max-md:h-[280px] max-sm:h-[250px] max-xs:h-[220px] transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                              {isNew && (
                                <Badge className="absolute top-2 right-2 bg-[#ffc82a] text-[#21466D] text-xs font-semibold shadow-md">
                                  {t("common.new")}
                                </Badge>
                              )}
                            </div>
                            <h3
                              title={book.Book.name}
                              className="font-semibold text-lg mb-2 group-hover:text-[#21466D] transition-colors line-clamp-2 min-h-[3.5rem] max-sm:text-base max-xs:text-sm"
                            >
                              {book.Book.name
                                .split(/[:\s]+/)
                                .slice(0, 3)
                                .join(" ")}
                              {book.Book.name.split(/[:\s]+/).length > 3 ? "..." : ""}
                            </h3>
                            <div className="space-y-1 text-sm text-muted-foreground mb-4 max-xs:text-xs">
                              <p>
                                {book.Book.page} {t("common.page")}
                              </p>
                              <p>
                                {book.Book.year}-{t("common.year")}
                              </p>
                              <p className="text-xs text-[#21466D] font-medium">
                                {t("common.author")}: {book.Book.Auther?.name || t("common.unknown")}
                              </p>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex flex-col gap-2 max-sm:gap-1 max-sm:p-3 max-xs:p-2">
                            <MagnetButton className="w-full">
                              <Button
                                className="w-full !bg-[#21466D] text-white hover:!bg-white border-2 font-bold border-transparent hover:!border-[#21466D] hover:!text-[#21466D] flex items-center justify-center gap-2 bg-transparent transition-all duration-300 max-sm:text-sm max-xs:text-xs max-xs:py-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  isTokenyes(() => handleCardClick(book.Book.id))
                                }}
                              >
                                <Info className="h-4 w-4 mr-2 max-xs:h-3 max-xs:w-3 max-xs:mr-1" /> 
                                {t("common.details")}
                              </Button>
                            </MagnetButton>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    </SwiperSlide>
                  )
                })}
          </Swiper>
        </div>
      </motion.div>

      <style jsx global>{`

        .book-swiper {
          padding: 20px 0 40px 0 !important;
          overflow-x: hidden;
        }

        .book-swiper .swiper-pagination {
          bottom: 10px !important;
        }

        .book-swiper .swiper-pagination-bullet {
          background: #21466D;
          opacity: 0.3;
          width: 8px;
          height: 8px;
        }

        .book-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.2);
        }

        .book-swiper .swiper-slide {
          height: auto;
          display: flex;
        }

        .book-swiper .swiper-slide > div {
          width: 100%;
          height: 100%;
        }

Az1z_404, [8/6/25 4:08 PM]


        /* Responsive adjustments */
        @media (max-width: 640px) {
          .book-swiper {
            padding: 15px 0 35px 0 !important;
          }
          
          .book-swiper .swiper-pagination-bullet {
            width: 6px;
            height: 6px;
            margin: 0 3px;
          }
        }

        @media (max-width: 480px) {
          .book-swiper {
            padding: 10px 0 30px 0 !important;
          }
        }
      `}</style>
    </div>
  )
}