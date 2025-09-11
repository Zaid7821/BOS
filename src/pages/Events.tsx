import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, Star, BookOpen, Trophy } from "lucide-react";

const Events = () => {
  const upcomingEvents = [
    {
      title: "Annual Science Fair",
      date: "March 15, 2024",
      time: "9:00 AM - 4:00 PM",
      location: "Main Auditorium",
      description: "Students showcase innovative science projects and experiments",
      category: "Academic",
      attendees: "Open to all"
    },
    {
      title: "Spring Cultural Festival",
      date: "April 8, 2024", 
      time: "6:00 PM - 9:00 PM",
      location: "School Courtyard",
      description: "Celebrating our diverse community with performances, food, and art",
      category: "Cultural",
      attendees: "Students & Families"
    },
    {
      title: "Parent-Teacher Conferences",
      date: "April 22-23, 2024",
      time: "3:00 PM - 7:00 PM",
      location: "Individual Classrooms",
      description: "Scheduled meetings to discuss student progress",
      category: "Academic",
      attendees: "Parents & Teachers"
    },
    {
      title: "High School Graduation",
      date: "May 25, 2024",
      time: "2:00 PM - 5:00 PM", 
      location: "Main Auditorium",
      description: "Celebrating our graduating class of 2024",
      category: "Graduation",
      attendees: "Graduates & Families"
    },
    {
      title: "Summer Camp Registration",
      date: "June 1, 2024",
      time: "Online Registration",
      location: "School Website",
      description: "Registration opens for summer enrichment programs",
      category: "Registration",
      attendees: "All Students"
    }
  ];

  const recentNews = [
    {
      title: "Outstanding SAT Scores Achievement",
      date: "February 28, 2024",
      summary: "Our students achieved an average SAT score of 1,350, placing us in the top 10% of schools nationwide.",
      category: "Achievement",
      featured: true
    },
    {
      title: "New STEM Laboratory Opens",
      date: "February 20, 2024", 
      summary: "State-of-the-art science and technology lab officially opens, featuring cutting-edge equipment.",
      category: "Facilities",
      featured: false
    },
    {
      title: "Regional Math Competition Winners",
      date: "February 15, 2024",
      summary: "Our math team secured first place in the regional mathematics competition for the third consecutive year.",
      category: "Achievement",
      featured: true
    },
    {
      title: "Arts Program Expansion Announced",
      date: "February 10, 2024",
      summary: "New visual and performing arts programs launching next semester, including digital media and theater.",
      category: "Programs",
      featured: false
    },
    {
      title: "Community Service Recognition",
      date: "February 5, 2024",
      summary: "School recognized by city council for outstanding community service contributions by students.",
      category: "Community",
      featured: false
    },
    {
      title: "International Exchange Program",
      date: "January 30, 2024",
      summary: "New partnership with schools in Asia and Europe offers students global learning opportunities.",
      category: "Programs",
      featured: true
    }
  ];

  const categoryColors = {
    Academic: "bg-primary text-primary-foreground",
    Cultural: "bg-secondary text-secondary-foreground",
    Graduation: "bg-accent text-accent-foreground", 
    Registration: "bg-muted text-muted-foreground",
    Achievement: "bg-accent text-accent-foreground",
    Facilities: "bg-primary text-primary-foreground",
    Programs: "bg-secondary text-secondary-foreground",
    Community: "bg-muted text-muted-foreground"
  };

  return (
    <Layout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="bg-gradient-subtle py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6">
              Stay Connected
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Events & News
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay informed about upcoming events, important announcements, and 
              celebrate our community's achievements and milestones.
            </p>
          </div>
        </section>

        {/* Events & News Tabs */}
        <section className="container mx-auto px-4">
          <Tabs defaultValue="events" className="w-full">
            <div className="text-center mb-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="events">Upcoming Events</TabsTrigger>
                <TabsTrigger value="news">Recent News</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="events" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4">Upcoming Events</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Mark your calendar for these important school events and activities
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingEvents.map((event, index) => (
                  <Card key={index} className="shadow-school-md border-primary/10 hover:shadow-school-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-xl text-primary">{event.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={categoryColors[event.category as keyof typeof categoryColors]}>
                          {event.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {event.description}
                      </CardDescription>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span>{event.attendees}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline" size="lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  View Full Calendar
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="news" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4">Recent News & Updates</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Stay updated with the latest achievements and announcements from our school
                </p>
              </div>

              {/* Featured News */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center">
                  <Star className="w-6 h-6 mr-2 text-secondary" />
                  Featured Stories
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {recentNews.filter(news => news.featured).map((news, index) => (
                    <Card key={index} className="shadow-school-lg border-primary/20 bg-gradient-subtle">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-xl text-primary">{news.title}</CardTitle>
                          <Badge className={categoryColors[news.category as keyof typeof categoryColors]}>
                            {news.category}
                          </Badge>
                        </div>
                        <CardDescription className="text-muted-foreground">
                          {news.date}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{news.summary}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* All News */}
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-6">All News Updates</h3>
                <div className="space-y-4">
                  {recentNews.map((news, index) => (
                    <Card key={index} className="shadow-school-sm border-primary/10 hover:shadow-school-md transition-all duration-300">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-primary">{news.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {news.category}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-2">{news.summary}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{news.date}</span>
                            </div>
                          </div>
                          {news.featured && (
                            <Star className="w-5 h-5 text-secondary ml-4" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Button variant="outline" size="lg">
                  <BookOpen className="mr-2 h-5 w-5" />
                  View News Archive
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-gradient-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss important school updates, 
              events, and achievements.
            </p>
            <div className="max-w-md mx-auto">
              <Button variant="secondary" size="lg" className="w-full text-lg px-8 py-4">
                Subscribe to Newsletter
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center shadow-school-md border-primary/10 hover:shadow-school-lg transition-all duration-300">
              <CardHeader>
                <Calendar className="w-12 h-12 mx-auto text-primary mb-4" />
                <CardTitle className="text-primary">School Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  View the complete academic calendar with all important dates
                </p>
                <Button variant="outline" className="w-full">
                  View Calendar
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center shadow-school-md border-primary/10 hover:shadow-school-lg transition-all duration-300">
              <CardHeader>
                <Trophy className="w-12 h-12 mx-auto text-secondary mb-4" />
                <CardTitle className="text-primary">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Celebrate our students' and school's accomplishments
                </p>
                <Button variant="secondary" className="w-full">
                  View Achievements
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center shadow-school-md border-primary/10 hover:shadow-school-lg transition-all duration-300">
              <CardHeader>
                <BookOpen className="w-12 h-12 mx-auto text-accent mb-4" />
                <CardTitle className="text-primary">News Archive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Browse through our complete news and updates archive
                </p>
                <Button variant="academic" className="w-full">
                  Browse Archive
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Events;