# Sports

Sports NativeScript Mobile App with Kinvey RapidData/ProgressData and Flex Data Connector to OpenEdge PASOE

Features:
---------
* sign in screen w/ app version/date and company info, TOS and privacy links
* note: sign in using salesrep 3-letter initials, e.g. RDR/rdr, BBB/bbb etc.
* customers (list) screen w/ a) on-scroll auto paging, b) filter by rep (user signed in) and c) sort option by number or name
* orders (list) screen w/ on-scroll auto paging, add order, delete order
* order detail screen w/ 3 tabs: lines, order, customer, w/ add line, order delete, order update and customer update
* date picker for order date fields
* order line screen w/ line delete/update and photo
* item lookup w/ paging and search
* item info screen with photo and camera
* bouncing ball loading spinner using NativeScript animations
* action bar buttons animated upon touch
* flex data CRUD for OE/JFP using JSDO
* multi-table flex function using JSDO invoke
* rapid data / progress data for small static tables e.g. states
* kinvey data store for images
* arcade AWS vm PASOE basic auth

Notes:
------
a) Field value edits (within the order detail screen tabs and order line screen) are only working on iOS as Android has trouble fitting text field inside list view for an inline edit effect (works like a charm in iOS,) therefore I've disabled this for Android. I'm going to fix this by either adding a dialog or new screen.

b) Since an invoke method was used for getting order detail data as an example of a complex dataset via Kinvey flex function, it only works online. I'm working on a fix which may involve a new flex function that queries collections using the dataStore module. If that doesn't work, then I can just query each collection directly from the NativeScript app without the need for a flex function. In any case, all three approaches may be applicable to a real world app and this demo app is just a showcase of what can be done so it's good to explore each option.

c) I continuously enhance these features so make sure to update (pull) from the repository at any time. The Flex data connector is under the sportsflex subdirectory. Although it is written to be as generic and reusable as possible, this may not necessarily be be the case at any given application -- feel free to copy and adapt to your needs. Last but not least, there are still some MongoDB query properties I need to map to JFP, but the most important CRUD stuff works fine.

Mauricio dos Santos
April 10 2019