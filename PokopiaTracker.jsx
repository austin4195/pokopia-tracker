import React, { useState, useEffect, useMemo, useRef } from "react";
import { Check, Search, X, Download, Upload, Sprout, Home, Leaf, Target, Hammer,
         Clock, Plus, ChevronDown, ChevronRight, Trash2, Copy } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────
   POKOPIA TRACKER v5 — island board with habitat INSTANCES
   Each built habitat is its own instance (unique id), so you can build two of
   the same type and track each occupant independently. Place a Pokémon onto an
   instance tile = occupied; into Houses = housed; empty tile = built-empty.
   ───────────────────────────────────────────────────────────────────────── */

const HABITAT_DATA = {"Bulbasaur":[{"n":1,"name":"Tall grass","req":"4 tall grass","cond":""},{"n":22,"name":"Bench with greenery","req":"2 hedges (any), 1 seat (wide)","cond":""}],"Squirtle":[{"n":1,"name":"Tall grass","req":"4 tall grass","cond":""},{"n":4,"name":"Hydrated tall grass","req":"4 tall grass, 2 water","cond":""}],"Charmander":[{"n":1,"name":"Tall grass","req":"4 tall grass","cond":"sunny and cloudy only"}],"Oddish":[{"n":1,"name":"Tall grass","req":"4 tall grass","cond":"night only"}],"Geodude":[{"n":1,"name":"Tall grass","req":"4 tall grass","cond":"Palette Town only"}],"Charizard":[{"n":1,"name":"Tall grass","req":"4 tall grass","cond":"sunny and cloudy only"},{"n":40,"name":"Berry-feast campsite","req":"1 Castform weather charm (sun), 1 lit bonfire, 1 berry basket, 1 high-up location","cond":"sunny/cloudy only"}],"Scyther":[{"n":2,"name":"Tree-shaded tall grass","req":"1 large tree (any), 4 tall grass","cond":""}],"Scizor":[{"n":2,"name":"Tree-shaded tall grass","req":"1 large tree (any), 4 tall grass","cond":"Palette Town only"}],"Bellsprout":[{"n":2,"name":"Tree-shaded tall grass","req":"1 large tree (any), 4 tall grass","cond":""}],"Pinsir":[{"n":2,"name":"Tree-shaded tall grass","req":"1 large tree (any), 4 tall grass","cond":""}],"Heracross":[{"n":2,"name":"Tree-shaded tall grass","req":"1 large tree (any), 4 tall grass","cond":""}],"Skwovet":[{"n":2,"name":"Tree-shaded tall grass","req":"1 large tree (any), 4 tall grass","cond":"Palette Town only"}],"Timburr":[{"n":3,"name":"Boulder-shaded tall grass","req":"4 tall grass, 1 large boulder","cond":""}],"Gurdurr":[{"n":3,"name":"Boulder-shaded tall grass","req":"4 tall grass, 1 large boulder","cond":""},{"n":28,"name":"Large luggage carrier","req":"1 cart, 2 wooden crates","cond":""}],"Machop":[{"n":3,"name":"Boulder-shaded tall grass","req":"4 tall grass, 1 large boulder","cond":"Palette Town only"},{"n":127,"name":"Box to the rhythm","req":"1 punching bag, 1 table (any), 1 CD player","cond":""}],"Wartortle":[{"n":4,"name":"Hydrated tall grass","req":"4 tall grass, 2 water","cond":""}],"Blastoise":[{"n":4,"name":"Hydrated tall grass","req":"4 tall grass, 2 water","cond":""},{"n":36,"name":"Floating in the shade","req":"1 inflatable boat, 1 beach parasol, 2 water","cond":""}],"Sliggoo":[{"n":4,"name":"Hydrated tall grass","req":"4 tall grass, 2 water","cond":"rain only"}],"Cramorant":[{"n":4,"name":"Hydrated tall grass","req":"4 tall grass, 2 water","cond":"Palette Town only"}],"Slowpoke":[{"n":5,"name":"Seaside tall grass","req":"4 tall grass, 2 ocean water","cond":""}],"Slowbro":[{"n":5,"name":"Seaside tall grass","req":"4 tall grass, 2 ocean water","cond":""},{"n":30,"name":"Bed with a plush","req":"1 bed (any), 1 doll (any)","cond":""},{"n":184,"name":"Fishing pond","req":"1 fishing rod, 1 seat (any), 1 water","cond":""}],"Slowking":[{"n":5,"name":"Seaside tall grass","req":"4 tall grass, 2 ocean water","cond":""},{"n":30,"name":"Bed with a plush","req":"1 bed (any), 1 doll (any)","cond":""},{"n":184,"name":"Fishing pond","req":"1 fishing rod, 1 seat (any), 1 water","cond":""}],"Pidgey":[{"n":6,"name":"Elevated tall grass","req":"4 tall grass, 1 high-up location","cond":"day only"},{"n":8,"name":"Pretty flower bed","req":"4 wildflowers","cond":"day only"}],"Pidgeotto":[{"n":6,"name":"Elevated tall grass","req":"4 tall grass, 1 high-up location","cond":"day only"},{"n":8,"name":"Pretty flower bed","req":"4 wildflowers","cond":"day only"}],"Hoothoot":[{"n":6,"name":"Elevated tall grass","req":"4 tall grass, 1 high-up location","cond":"night only"},{"n":8,"name":"Pretty flower bed","req":"4 wildflowers","cond":"night only"},{"n":31,"name":"Gently lit bed","req":"1 bed (any), 1 table (any), 1 lit slender candle","cond":"night only"}],"Noctowl":[{"n":6,"name":"Elevated tall grass","req":"4 tall grass, 1 high-up location","cond":"night only"},{"n":31,"name":"Gently lit bed","req":"1 bed (any), 1 table (any), 1 lit slender candle","cond":"night only"}],"Venonat":[{"n":7,"name":"Illuminated tall grass","req":"4 tall grass (any), 1 lighting (any)","cond":"night only"},{"n":23,"name":"Illuminated bench","req":"1 seat (wide), 1 powered streetlight (any)","cond":"night only"}],"Venomoth":[{"n":7,"name":"Illuminated tall grass","req":"4 tall grass (any), 1 lighting (any)","cond":"night only"},{"n":23,"name":"Illuminated bench","req":"1 seat (wide), 1 powered streetlight (any)","cond":"night only"}],"Combee":[{"n":8,"name":"Pretty flower bed","req":"4 wildflowers","cond":""}],"Eevee":[{"n":8,"name":"Pretty flower bed","req":"4 wildflowers","cond":"Palette Town only"}],"Magby":[{"n":8,"name":"Pretty flower bed","req":"4 wildflowers","cond":"Palette Town only"}],"Goomy":[{"n":9,"name":"Tree-shaded flower bed","req":"1 berry tree (any), 4 wildflowers","cond":"rain only"},{"n":41,"name":"Rain Dance site","req":"2 Castform weather charm (rain), 1 plated food","cond":"rain only"}],"Cacturne":[{"n":9,"name":"Tree-shaded flower bed","req":"1 berry tree (any), 4 wildflowers","cond":"night only"}],"Vikavolt":[{"n":9,"name":"Tree-shaded flower bed","req":"1 berry tree (any), 4 wildflowers","cond":"Palette Town only"}],"Volbeat":[{"n":10,"name":"Hydrated flower bed","req":"4 wildflowers, 2 water","cond":""}],"Illumise":[{"n":10,"name":"Hydrated flower bed","req":"4 wildflowers, 2 water","cond":""}],"Vespiquen":[{"n":11,"name":"Field of flowers","req":"8 wildflowers","cond":""}],"Ivysaur":[{"n":11,"name":"Field of flowers","req":"8 wildflowers","cond":""},{"n":22,"name":"Bench with greenery","req":"2 hedges (any), 1 seat (wide)","cond":""}],"Venusaur":[{"n":11,"name":"Field of flowers","req":"8 wildflowers","cond":""},{"n":46,"name":"Garden terrace","req":"4 wildflowers, 1 garden chair, 1 lit garden light, 1 garden table","cond":""}],"Paras":[{"n":12,"name":"Elevated flower bed","req":"4 wildflowers, 1 high-up location","cond":""},{"n":14,"name":"Flower garden","req":"4 hedges (any), 4 wildflowers","cond":""}],"Parasect":[{"n":12,"name":"Elevated flower bed","req":"4 wildflowers, 1 high-up location","cond":""},{"n":14,"name":"Flower garden","req":"4 hedges (any), 4 wildflowers","cond":""}],"Cubone":[{"n":13,"name":"Grave with flowers","req":"4 wildflowers, 1 gravestone","cond":""}],"Marowak":[{"n":13,"name":"Grave with flowers","req":"4 wildflowers, 1 gravestone","cond":""}],"Rowlet":[{"n":15,"name":"Fresh veggie field","req":"8 vegetable field (any)","cond":"Palette Town only [community-confirmed]"}],"Drilbur":[{"n":15,"name":"Fresh veggie field","req":"8 vegetable field (any)","cond":""}],"Excadrill":[{"n":15,"name":"Fresh veggie field","req":"8 vegetable field (any)","cond":""}],"Drifloon":[{"n":16,"name":"Riding warm updrafts","req":"3 lit campfires","cond":""},{"n":30,"name":"Bed with a plush","req":"1 bed (any), 1 doll (any)","cond":""},{"n":181,"name":"Plush central","req":"1 Arcanine doll, 1 Pikachu doll, 1 Dragonite doll, 1 Eevee doll","cond":""}],"Charmeleon":[{"n":17,"name":"Campsite","req":"1 lit campfire, 1 straw table, 1 straw stool","cond":"sunny and cloudy only"}],"Tyrogue":[{"n":18,"name":"Training waterfall","req":"1 seat (any), 2 water, 1 waterfall","cond":""}],"Gulpin":[{"n":19,"name":"Tantalizing dining set","req":"1 seat (any), 1 table (any), 1 plated food","cond":""}],"Pichu":[{"n":20,"name":"Picnic set","req":"1 seat (any), 1 table (any), 1 picnic basket","cond":"Withered Wasteland only"}],"Pikachu":[{"n":20,"name":"Picnic set","req":"1 seat (any), 1 table (any), 1 picnic basket","cond":"Palette Town only"}],"Weepinbell":[{"n":21,"name":"Flowery table","req":"1 seat (any), 1 table (any), 1 small vase","cond":""},{"n":35,"name":"Irresistible scent and glow","req":"1 pitcher-plant pot, 1 plated food, 1 mushroom lamp","cond":""}],"Victreebel":[{"n":21,"name":"Flowery table","req":"1 seat (any), 1 table (any), 1 small vase","cond":""},{"n":35,"name":"Irresistible scent and glow","req":"1 pitcher-plant pot, 1 plated food, 1 mushroom lamp","cond":""}],"Hitmonchan":[{"n":24,"name":"Exercise resting spot","req":"1 punching bag, 1 seat (any)","cond":""}],"Hitmonlee":[{"n":25,"name":"Urgent care","req":"1 seat (any), 1 table (any), 1 first aid kit","cond":""}],"Hitmontop":[{"n":26,"name":"Gym first aid","req":"1 table (any), 1 punching bag, 1 first aid kit","cond":""}],"W. Shellos":[{"n":27,"name":"Road sign","req":"1 arrow sign, 3 wooden path","cond":""}],"E. Shellos":[{"n":27,"name":"Road sign","req":"1 arrow sign, 3 wooden path","cond":""}],"Tinkatink":[{"n":28,"name":"Large luggage carrier","req":"1 cart, 2 wooden crates","cond":"Palette Town only"},{"n":154,"name":"Oversized dumping ground","req":"3 iron beams or columns, 1 tires, 1 waste bin (any), 1 microwave oven","cond":"Palette Town only"}],"Tinkatuff":[{"n":28,"name":"Large luggage carrier","req":"1 cart, 2 wooden crates","cond":"Palette Town only"},{"n":156,"name":"Sewer-hole inspection","req":"1 iron pipes, 1 sewer-hole cover, 1 excavation tools, 1 traffic cone","cond":"Palette Town only"}],"Axew":[{"n":29,"name":"Lumberjack's workplace","req":"1 log chair, 1 cart, 1 tree stump (any), 1 log table","cond":""},{"n":44,"name":"Cozy log handicrafts","req":"1 log chair, 1 log bed, 1 log table","cond":""}],"Fraxure":[{"n":29,"name":"Lumberjack's workplace","req":"1 log chair, 1 cart, 1 tree stump (any), 1 log table","cond":""},{"n":44,"name":"Cozy log handicrafts","req":"1 log chair, 1 log bed, 1 log table","cond":""}],"Haxorus":[{"n":29,"name":"Lumberjack's workplace","req":"1 log chair, 1 cart, 1 tree stump (any), 1 log table","cond":""},{"n":44,"name":"Cozy log handicrafts","req":"1 log chair, 1 log bed, 1 log table","cond":""}],"Munchlax":[{"n":30,"name":"Bed with a plush","req":"1 bed (any), 1 doll (any)","cond":"Palette Town only"},{"n":47,"name":"Tree-shaded snoozing Snorlax","req":"1 large tree (any), 1 naptime bed","cond":"Palette Town only"}],"Litwick":[{"n":32,"name":"Grave offering","req":"1 gravestone, 1 plated food, 2 lit slender candles","cond":""},{"n":33,"name":"Creepy grave offering","req":"2 lit eerie candles, 1 gravestone, 1 plated food","cond":""}],"Lampent":[{"n":32,"name":"Grave offering","req":"1 gravestone, 1 plated food, 2 lit slender candles","cond":""},{"n":33,"name":"Creepy grave offering","req":"2 lit eerie candles, 1 gravestone, 1 plated food","cond":""}],"Chandelure":[{"n":33,"name":"Creepy grave offering","req":"2 lit eerie candles, 1 gravestone, 1 plated food","cond":""}],"Vileplume":[{"n":34,"name":"Chansey resting area","req":"6 hedges (any), 1 Chansey plant, 1 seat (wide)","cond":""}],"Bellossom":[{"n":34,"name":"Chansey resting area","req":"6 hedges (any), 1 Chansey plant, 1 seat (wide)","cond":""}],"Onix":[{"n":37,"name":"Smooth tall grass","req":"1 dry tall grass, 1 smooth rock","cond":""}],"Magnemite":[{"n":38,"name":"Factory storage","req":"1 powered streetlight (any), 1 control unit, 1 metal drum, 1 jumbled cords","cond":""}],"Pidgeot":[{"n":39,"name":"Luxury chirp-chirp meal","req":"1 wooden birdhouse, 1 berry basket","cond":"daytime only"}],"Cacnea":[{"n":42,"name":"Sunny Day site","req":"2 Castform weather charm (sun), 1 plated food","cond":"sunny only"}],"Tangrowth":[{"n":43,"name":"Professor's treasure trove","req":"1 Professor's treasure trove, 4 lost relics (large), 1 bed (any)","cond":""}],"Goodra":[{"n":45,"name":"Very-berry space","req":"1 berry chair, 1 berry bed, 1 berry table, 1 powered berry table lamp","cond":"rain only"}],"Snorlax":[{"n":47,"name":"Tree-shaded snoozing Snorlax","req":"1 large tree (any), 1 naptime bed","cond":"Palette Town only"},{"n":48,"name":"Good old-fashioned antiques","req":"1 antique closet, 1 antique bed, 1 antique dresser, 1 antique chair","cond":"Palette Town only"},{"n":93,"name":"Gourmet's altar","req":"1 offering dish","cond":""}],"Weezing":[{"n":48,"name":"Good old-fashioned antiques","req":"1 antique closet, 1 antique bed, 1 antique dresser, 1 antique chair","cond":"Palette Town only"},{"n":63,"name":"Trash collection site","req":"1 waste bin (any), 1 sign (any), 1 garbage bags","cond":"Palette Town only"}],"Tangela":[{"n":49,"name":"Nothin' but Poke Balls","req":"1 Poke Ball sofa, 1 Poke Ball bed, 1 Poke Ball table, 1 powered Poke Ball light","cond":"Palette Town only"}],"Spinarak":[{"n":50,"name":"Yellow tall grass","req":"4 yellow tall grass","cond":""}],"Ariados":[{"n":50,"name":"Yellow tall grass","req":"4 yellow tall grass","cond":""}],"Grubbin":[{"n":50,"name":"Yellow tall grass","req":"4 yellow tall grass","cond":""},{"n":83,"name":"Vending machine break area","req":"1 powered vending machine, 1 seat (wide)","cond":""}],"Zubat":[{"n":51,"name":"Tree-shaded yellow tall grass","req":"1 large tree (any), 4 yellow tall grass","cond":"Bleak Beach only, night only"},{"n":66,"name":"Park bench","req":"1 seat (wide), 1 garbage bin","cond":"Bleak Beach, night only"}],"Golbat":[{"n":51,"name":"Tree-shaded yellow tall grass","req":"1 large tree (any), 4 yellow tall grass","cond":"night only"}],"Makuhita":[{"n":51,"name":"Tree-shaded yellow tall grass","req":"1 large tree (any), 4 yellow tall grass","cond":""},{"n":80,"name":"All packed up","req":"1 cart, 2 cardboard boxes","cond":""}],"Hariyama":[{"n":51,"name":"Tree-shaded yellow tall grass","req":"1 large tree (any), 4 yellow tall grass","cond":""},{"n":80,"name":"All packed up","req":"1 cart, 2 cardboard boxes","cond":""}],"Wingull":[{"n":52,"name":"Elevated yellow tall grass","req":"4 yellow tall grass, 1 high-up location","cond":"day only"},{"n":58,"name":"Windy flower bed","req":"1 windmill, 4 seashore flowers","cond":"day only"}],"Pelipper":[{"n":52,"name":"Elevated yellow tall grass","req":"4 yellow tall grass, 1 high-up location","cond":"day only"},{"n":58,"name":"Windy flower bed","req":"1 windmill, 4 seashore flowers","cond":"day only"}],"Crobat":[{"n":52,"name":"Elevated yellow tall grass","req":"4 yellow tall grass, 1 high-up location","cond":"night only"},{"n":65,"name":"Trash disposal site","req":"1 utility pole, 1 garbage bags","cond":"night only"}],"Azurill":[{"n":53,"name":"Hydrated yellow tall grass","req":"4 yellow tall grass, 2 water","cond":""},{"n":62,"name":"Perpetual mess","req":"1 cardboard boxes, 2 toys (any)","cond":""}],"Marill":[{"n":53,"name":"Hydrated yellow tall grass","req":"4 yellow tall grass, 2 water","cond":""},{"n":88,"name":"Dock","req":"4 walkways, 1 powered streetlight, 2 ocean water","cond":""}],"Piplup":[{"n":53,"name":"Hydrated yellow tall grass","req":"4 yellow tall grass, 2 water","cond":""}],"Prinplup":[{"n":53,"name":"Hydrated yellow tall grass","req":"4 yellow tall grass, 2 water","cond":""},{"n":86,"name":"Waterwheel spot","req":"1 waterwheel, 2 water, 1 waterfall","cond":""}],"Pal. Wooper":[{"n":54,"name":"Marshy tall grass","req":"4 yellow tall grass, 2 muddy water","cond":""}],"Clodsire":[{"n":54,"name":"Marshy tall grass","req":"4 yellow tall grass, 2 muddy water","cond":""},{"n":186,"name":"Marsh fishing spot","req":"1 fishing rod, 1 seat (any), 1 muddy water","cond":""}],"Mareep":[{"n":55,"name":"Overgrowth vending machine","req":"4 yellow tall grass, 1 powered vending machine","cond":""},{"n":77,"name":"Knitting station","req":"1 seat (any), 1 table (any), 1 knitting supplies","cond":""}],"Pawmi":[{"n":56,"name":"Breezy flower bed","req":"4 seashore flowers","cond":""},{"n":67,"name":"Tantalizing restaurant","req":"1 seat (any), 1 menu board, 1 table (any), 1 plated food","cond":""}],"Zorua":[{"n":56,"name":"Breezy flower bed","req":"4 seashore flowers","cond":""}],"Zoroark":[{"n":56,"name":"Breezy flower bed","req":"4 seashore flowers","cond":""},{"n":73,"name":"Surprise in store","req":"2 balloons, 1 boo-in-the-box","cond":""}],"Gloom":[{"n":57,"name":"Tropical vibes","req":"1 large palm tree, 4 seashore flowers","cond":""}],"Exeggcute":[{"n":57,"name":"Tropical vibes","req":"1 large palm tree, 4 seashore flowers","cond":""},{"n":59,"name":"Shaded beach","req":"1 large palm tree, 1 beach chair","cond":""}],"Exeggutor":[{"n":57,"name":"Tropical vibes","req":"1 large palm tree, 4 seashore flowers","cond":""},{"n":59,"name":"Shaded beach","req":"1 large palm tree, 1 beach chair","cond":""}],"Lapras":[{"n":60,"name":"Tropical seaside","req":"1 large palm tree, 2 hedges (any), 2 ocean water","cond":""}],"Meowth":[{"n":61,"name":"Resting spot","req":"1 cardboard boxes, 1 straw bed","cond":""},{"n":91,"name":"Working the register","req":"2 table (any), 1 powered cash register","cond":""}],"Growlithe":[{"n":62,"name":"Perpetual mess","req":"1 cardboard boxes, 2 toys (any)","cond":""},{"n":79,"name":"Resort meal prep","req":"1 large palm tree, 1 seat (any), 1 plated food, 1 campfire","cond":""}],"Trubbish":[{"n":63,"name":"Trash collection site","req":"1 waste bin (any), 1 sign (any), 1 garbage bags","cond":""}],"Garbodor":[{"n":63,"name":"Trash collection site","req":"1 waste bin (any), 1 sign (any), 1 garbage bags","cond":""}],"Koffing":[{"n":63,"name":"Trash collection site","req":"1 waste bin (any), 1 sign (any), 1 garbage bags","cond":"Palette Town only"}],"Magneton":[{"n":64,"name":"Trash can central","req":"4 garbage bins","cond":""},{"n":85,"name":"Mini game corner","req":"1 powered arcade machine, 1 seat (any), 1 punching game","cond":""}],"Magnezone":[{"n":64,"name":"Trash can central","req":"4 garbage bins","cond":""},{"n":85,"name":"Mini game corner","req":"1 powered arcade machine, 1 seat (any), 1 punching game","cond":""}],"Electabuzz":[{"n":64,"name":"Trash can central","req":"4 garbage bins","cond":""},{"n":72,"name":"Light-up stage","req":"2 powered spotlights, 1 powered small stage","cond":""}],"Voltorb":[{"n":66,"name":"Park bench","req":"1 seat (wide), 1 garbage bin","cond":""},{"n":90,"name":"Playing pirate","req":"2 barrels, 1 ship's wheel, 2 cannons","cond":""}],"Electrode":[{"n":66,"name":"Park bench","req":"1 seat (wide), 1 garbage bin","cond":""},{"n":90,"name":"Playing pirate","req":"2 barrels, 1 ship's wheel, 2 cannons","cond":""}],"Pawmo":[{"n":67,"name":"Tantalizing restaurant","req":"1 seat (any), 1 menu board, 1 table (any), 1 plated food","cond":""},{"n":70,"name":"Cafe space","req":"2 seats (any), 1 potted plant (any), 2 counters, 1 mug, 1 menu board","cond":""}],"Empoleon":[{"n":68,"name":"Tableside delivery cart","req":"2 chic chairs, 1 chic table, 1 small vase, 1 push cart, 1 plated food","cond":"rain only"},{"n":86,"name":"Waterwheel spot","req":"1 waterwheel, 2 water, 1 waterfall","cond":"rain only"}],"Torchic":[{"n":69,"name":"Chirp-chirp meal","req":"1 wooden birdhouse, 1 table (any), 1 plated food","cond":""},{"n":79,"name":"Resort meal prep","req":"1 large palm tree, 1 seat (any), 1 plated food, 1 campfire","cond":""}],"Blaziken":[{"n":69,"name":"Chirp-chirp meal","req":"1 wooden birdhouse, 1 table (any), 1 plated food","cond":""},{"n":87,"name":"Furnace spot","req":"1 metal drum, 1 furnace","cond":""}],"Pawmot":[{"n":70,"name":"Cafe space","req":"2 seats (any), 1 potted plant (any), 2 counters, 1 mug, 1 menu board","cond":""}],"S. Tatsugiri":[{"n":71,"name":"Beach set","req":"1 beach chair, 1 beach parasol, 1 side table","cond":""}],"D. Tatsugiri":[{"n":71,"name":"Beach set","req":"1 beach chair, 1 beach parasol, 1 side table","cond":""}],"C. Tatsugiri":[{"n":71,"name":"Beach set","req":"1 beach chair, 1 beach parasol, 1 side table","cond":""}],"Electivire":[{"n":72,"name":"Light-up stage","req":"2 powered spotlights, 1 powered small stage","cond":""},{"n":84,"name":"Vending machine set","req":"1 waste bin (any), 1 powered vending machine","cond":""}],"Haunter":[{"n":73,"name":"Surprise in store","req":"2 balloons, 1 boo-in-the-box","cond":"night only"},{"n":89,"name":"Spooky study","req":"1 bookcase, 1 chic sofa, 1 plain table, 1 lit slender candle","cond":"night only"}],"Gengar":[{"n":73,"name":"Surprise in store","req":"2 balloons, 1 boo-in-the-box","cond":"night only"}],"Flaafy":[{"n":74,"name":"Night festival venue","req":"2 balloons, 1 powered Raichu sign","cond":""},{"n":77,"name":"Knitting station","req":"1 seat (any), 1 table (any), 1 knitting supplies","cond":""}],"Minccino":[{"n":75,"name":"Changing area","req":"1 closet (any), 1 mirror (large)","cond":""},{"n":76,"name":"Private makeup stand","req":"2 partitions (any), 1 closet (any), 1 dresser (any)","cond":""}],"Cinccino":[{"n":76,"name":"Private makeup stand","req":"2 partitions (any), 1 closet (any), 1 dresser (any)","cond":""}],"Psyduck":[{"n":78,"name":"Hot-spring shower","req":"1 shower, 1 seat (any), 2 hot-spring water","cond":""}],"Golduck":[{"n":78,"name":"Hot-spring shower","req":"1 shower, 1 seat (any), 2 hot-spring water","cond":""}],"Combusken":[{"n":79,"name":"Resort meal prep","req":"1 large palm tree, 1 seat (any), 1 plated food, 1 campfire","cond":""},{"n":87,"name":"Furnace spot","req":"1 metal drum, 1 furnace","cond":""}],"Farfetch'd":[{"n":80,"name":"All packed up","req":"1 cart, 2 cardboard boxes","cond":""}],"Chansey":[{"n":81,"name":"Full recovery","req":"1 bed (any), 1 plain chest, 1 first aid kit","cond":""}],"Peakychu":[{"n":81,"name":"Full recovery","req":"1 bed (any), 1 plain chest, 1 first aid kit","cond":""}],"Happiny":[{"n":82,"name":"Alarm clock sleep zone","req":"1 bed (any), 1 table (any), 1 alarm clock","cond":""},{"n":91,"name":"Working the register","req":"2 table (any), 1 powered cash register","cond":""}],"Charjabug":[{"n":83,"name":"Vending machine break area","req":"1 powered vending machine, 1 seat (wide)","cond":""}],"Elekid":[{"n":84,"name":"Vending machine set","req":"1 waste bin (any), 1 powered vending machine","cond":""}],"Azumarill":[{"n":88,"name":"Dock","req":"4 walkways, 1 powered streetlight, 2 ocean water","cond":"rain only"}],"Gastly":[{"n":89,"name":"Spooky study","req":"1 bookcase, 1 chic sofa, 1 plain table, 1 lit slender candle","cond":"night only"}],"Audino":[{"n":91,"name":"Working the register","req":"2 table (any), 1 powered cash register","cond":""}],"Mawile":[{"n":91,"name":"Working the register","req":"2 table (any), 1 powered cash register","cond":"Palette Town only"}],"Smearguru":[{"n":92,"name":"Tiny atelier","req":"1 canvas, 1 seat (any)","cond":""}],"Mimikyu":[{"n":94,"name":"Pikachu space","req":"1 Pikachu sofa, 1 Pikachu doll","cond":""}],"Blissey":[{"n":95,"name":"Cuteness overload","req":"1 cute sofa, 1 cute table, 1 powered cute lamp, 1 cute bed, 1 cute dresser","cond":""}],"Absol":[{"n":96,"name":"Welcoming resort","req":"1 resort sofa, 1 resort table, 1 resort hammock, 1 powered resort light","cond":""}],"Ampharos":[{"n":97,"name":"Plain life","req":"1 plain bed, 1 plain sofa, 1 plain table, 1 lit plain lamp","cond":""}],"Scorbunny":[{"n":98,"name":"Red tall grass","req":"4 red tall grass","cond":""}],"Riolu":[{"n":98,"name":"Red tall grass","req":"4 red tall grass","cond":""},{"n":127,"name":"Box to the rhythm","req":"1 punching bag, 1 table (any), 1 CD player","cond":""}],"Kricketot":[{"n":98,"name":"Red tall grass","req":"4 red tall grass","cond":""},{"n":128,"name":"Music and magazines","req":"1 CD player, 1 CD rack, 1 magazine rack","cond":""}],"Kricketune":[{"n":98,"name":"Red tall grass","req":"4 red tall grass","cond":""},{"n":128,"name":"Music and magazines","req":"1 CD player, 1 CD rack, 1 magazine rack","cond":""}],"Cinderace":[{"n":98,"name":"Red tall grass","req":"4 red tall grass","cond":""},{"n":130,"name":"Refreshing locker room","req":"2 office lockers, 1 potted plant (any), 1 seat (wide), 1 punching game","cond":""}],"Diglett":[{"n":99,"name":"Tree-shaded red tall grass","req":"1 large tree (any), 4 red tall grass","cond":""},{"n":119,"name":"Container snacking","req":"1 barrel, 1 wooden crate, 1 lantern, 1 plated food","cond":""}],"Dugtrio":[{"n":99,"name":"Tree-shaded red tall grass","req":"1 large tree (any), 4 red tall grass","cond":""},{"n":123,"name":"House party","req":"1 food counter, 1 paper party cups, 1 plated food","cond":""}],"Bonsly":[{"n":99,"name":"Tree-shaded red tall grass","req":"1 large tree (any), 4 red tall grass","cond":""}],"Sudowoodo":[{"n":99,"name":"Tree-shaded red tall grass","req":"1 large tree (any), 4 red tall grass","cond":""},{"n":123,"name":"House party","req":"1 food counter, 1 paper party cups, 1 plated food","cond":""}],"Dartrix":[{"n":100,"name":"Pointy tree-shaded rocky tall grass","req":"1 pointy tree, 4 red tall grass, 1 large boulder","cond":""}],"Decidueye":[{"n":100,"name":"Pointy tree-shaded rocky tall grass","req":"1 pointy tree, 4 red tall grass, 1 large boulder","cond":""},{"n":136,"name":"Modern living","req":"1 industrial bed, 1 industrial desk, 1 industrial chair","cond":""}],"Lotad":[{"n":101,"name":"Hydrated red tall grass","req":"4 red tall grass, 2 water","cond":""},{"n":109,"name":"Uplifting duckweed","req":"4 duckweed, 2 water","cond":""},{"n":187,"name":"Hot-spring fishing spot","req":"1 fishing rod, 1 seat (any), 1 hot-spring water","cond":""}],"Lombre":[{"n":101,"name":"Hydrated red tall grass","req":"4 red tall grass, 2 water","cond":""},{"n":187,"name":"Hot-spring fishing spot","req":"1 fishing rod, 1 seat (any), 1 hot-spring water","cond":""}],"Chatot":[{"n":102,"name":"Elevated red tall grass","req":"4 red tall grass, 1 high-up location","cond":"day only"},{"n":125,"name":"Chirping recital","req":"1 perch, 1 standing mic","cond":"day only"}],"Murkrow":[{"n":102,"name":"Elevated red tall grass","req":"4 red tall grass, 1 high-up location","cond":"night only"},{"n":105,"name":"Tree-shaded graceful flower bed","req":"1 pointy tree, 4 mountain flowers","cond":"night only"}],"Honchkrow":[{"n":102,"name":"Elevated red tall grass","req":"4 red tall grass, 1 high-up location","cond":"night only"},{"n":125,"name":"Chirping recital","req":"1 perch, 1 standing mic","cond":"night only"}],"Machoke":[{"n":103,"name":"Grassy training field","req":"2 sandbags, 4 red tall grass","cond":""}],"Machamp":[{"n":103,"name":"Grassy training field","req":"2 sandbags, 4 red tall grass","cond":""},{"n":117,"name":"Clink-clang iron construction","req":"3 iron beams or columns, 1 wheelbarrow, 1 sandbag, 1 excavation tools","cond":""}],"Cleffa":[{"n":104,"name":"Graceful flower bed","req":"4 mountain flowers","cond":"night only"}],"Clefairy":[{"n":104,"name":"Graceful flower bed","req":"4 mountain flowers","cond":"night only"},{"n":131,"name":"Bronze landmark","req":"4 hedges (any), 1 moonlight dance statue, 1 sign","cond":"night only"}],"Clefable":[{"n":104,"name":"Graceful flower bed","req":"4 mountain flowers","cond":"night only"},{"n":131,"name":"Bronze landmark","req":"4 hedges (any), 1 moonlight dance statue, 1 sign","cond":"night only"}],"Fidough":[{"n":104,"name":"Graceful flower bed","req":"4 mountain flowers","cond":"day only"},{"n":121,"name":"Best bread bakery","req":"1 bread oven, 2 counters, 1 plated food","cond":"day only"}],"Dachsbun":[{"n":104,"name":"Graceful flower bed","req":"4 mountain flowers","cond":"day only"},{"n":121,"name":"Best bread bakery","req":"1 bread oven, 2 counters, 1 plated food","cond":"day only"}],"Larvesta":[{"n":105,"name":"Tree-shaded graceful flower bed","req":"1 pointy tree, 4 mountain flowers","cond":""}],"Volcarona":[{"n":105,"name":"Tree-shaded graceful flower bed","req":"1 pointy tree, 4 mountain flowers","cond":""},{"n":115,"name":"Piping-hot lava","req":"1 molten rock, 2 lava","cond":""}],"Ekans":[{"n":106,"name":"Hydrated graceful flower bed","req":"4 mountain flowers, 2 water","cond":""}],"Arbok":[{"n":106,"name":"Hydrated graceful flower bed","req":"4 mountain flowers, 2 water","cond":""}],"Politoed":[{"n":106,"name":"Hydrated graceful flower bed","req":"4 mountain flowers, 2 water","cond":""},{"n":107,"name":"Flower garden stump stage","req":"4 mountain flowers, 1 tree stump (any), 2 mushroom lamp","cond":""},{"n":114,"name":"Harmonious hot spring","req":"1 hot-spring spout, 1 water basin, 2 hot-spring water","cond":""}],"Igglybuff":[{"n":107,"name":"Flower garden stump stage","req":"4 mountain flowers, 1 tree stump (any), 2 mushroom lamp","cond":""}],"Jigglypuff":[{"n":107,"name":"Flower garden stump stage","req":"4 mountain flowers, 1 tree stump (any), 2 mushroom lamp","cond":""},{"n":126,"name":"Recital stage","req":"2 speakers, 1 powered small stage, 1 standing mic","cond":""}],"Tyranitar":[{"n":108,"name":"Toil in the soil","req":"4 vegetable fields (any), 1 wheelbarrow","cond":""},{"n":110,"name":"Mossy rest spot","req":"4 moss","cond":""}],"Ludicolo":[{"n":109,"name":"Uplifting duckweed","req":"4 duckweed, 2 water","cond":""}],"Larvitar":[{"n":110,"name":"Mossy rest spot","req":"4 moss","cond":""}],"Graveler":[{"n":111,"name":"Mossy boulder","req":"4 moss, 1 mossy boulder","cond":""}],"Golem":[{"n":111,"name":"Mossy boulder","req":"4 moss, 1 mossy boulder","cond":""}],"Torkoal":[{"n":112,"name":"Mossy hot spring","req":"3 moss, 2 hot-spring water","cond":""}],"Raboot":[{"n":113,"name":"Open-air bath","req":"1 hot-spring spout, 2 hot-spring water","cond":""},{"n":130,"name":"Refreshing locker room","req":"2 office lockers, 1 potted plant (any), 1 seat (wide), 1 punching game","cond":""}],"Charcadet":[{"n":115,"name":"Piping-hot lava","req":"1 molten rock, 2 lava","cond":""}],"Magmar":[{"n":116,"name":"Digging and burning","req":"1 wheelbarrow, 1 smelting furnace, 1 excavation tools","cond":""}],"Steelix":[{"n":117,"name":"Clink-clang iron construction","req":"3 iron beams or columns, 1 wheelbarrow, 1 sandbag, 1 excavation tools","cond":""}],"Glimmet":[{"n":118,"name":"Creepy white rocks","req":"1 stalagmites, 4 moss, 1 wooden crate, 1 lantern","cond":""},{"n":119,"name":"Container snacking","req":"1 barrel, 1 wooden crate, 1 lantern, 1 plated food","cond":""}],"Glimmora":[{"n":118,"name":"Creepy white rocks","req":"1 stalagmites, 4 moss, 1 wooden crate, 1 lantern","cond":""},{"n":119,"name":"Container snacking","req":"1 barrel, 1 wooden crate, 1 lantern, 1 plated food","cond":""}],"Swalot":[{"n":120,"name":"Dinner table surprise","req":"2 seats (wide), 1 table (large), 4 party platters","cond":""}],"Magmortar":[{"n":122,"name":"Mini kitchen","req":"1 kitchen table, 1 cooking stove, 1 frying pan (any), 1 modern sink","cond":""}],"Toxel":[{"n":124,"name":"Lazy photo-album scrolling","req":"1 paper party cups, 1 tablet","cond":"Rocky Ridges only"}],"Wigglytuff":[{"n":126,"name":"Recital stage","req":"2 speakers, 1 powered small stage, 1 standing mic","cond":""}],"Lucario":[{"n":127,"name":"Box to the rhythm","req":"1 punching bag, 1 table (any), 1 CD player","cond":""}],"DJ Rotom":[{"n":128,"name":"Music and magazines","req":"1 CD player, 1 CD rack, 1 magazine rack","cond":""}],"Gimmighoul":[{"n":129,"name":"Mini museum","req":"3 posts (any), 1 pedestal/exhibition stand, 1 lost relic (large)","cond":""}],"Arcanine":[{"n":129,"name":"Mini museum","req":"3 posts (any), 1 pedestal/exhibition stand, 1 lost relic (large)","cond":""},{"n":188,"name":"Magma fishing spot","req":"1 fishing rod, 1 seat (any), 1 lava","cond":""}],"Rolycoly":[{"n":132,"name":"Railroad crossing","req":"1 railway track, 1 crossing gate","cond":""}],"Carkoal":[{"n":132,"name":"Railroad crossing","req":"1 railway track, 1 crossing gate","cond":""}],"Coalossal":[{"n":132,"name":"Railroad crossing","req":"1 railway track, 1 crossing gate","cond":""},{"n":135,"name":"Heavy iron","req":"1 iron bed, 1 iron table, 1 iron chair, 1 lit lantern","cond":""}],"Chef Greedent":[{"n":133,"name":"Chef's kitchen","req":"1 cooking stove, 1 modern sink, 1 plain table, 1 stylish cooking pot, 1 cutting board, 1 plated food","cond":""}],"Gholdengo":[{"n":134,"name":"Absolute luxury","req":"1 lit luxury lamp, 1 luxury bed, 1 luxury sofa, 1 luxury table","cond":""}],"Trapinch":[{"n":137,"name":"Pink tall grass","req":"4 pink tall grass","cond":""}],"Vibrava":[{"n":137,"name":"Pink tall grass","req":"4 pink tall grass","cond":""}],"Flygon":[{"n":137,"name":"Pink tall grass","req":"4 pink tall grass","cond":""}],"Swablu":[{"n":137,"name":"Pink tall grass","req":"4 pink tall grass","cond":""}],"Duskull":[{"n":137,"name":"Pink tall grass","req":"4 pink tall grass","cond":"night only"}],"Sprigatito":[{"n":138,"name":"Tree-shaded pink tall grass","req":"1 large tree (any), 4 pink tall grass","cond":""},{"n":155,"name":"Interrogation desk","req":"1 Arcanine doll, 2 folding chairs, 1 industrial desk, 1 lit desk light","cond":""}],"Dreepy":[{"n":138,"name":"Tree-shaded pink tall grass","req":"1 large tree (any), 4 pink tall grass","cond":""}],"Drakloak":[{"n":138,"name":"Tree-shaded pink tall grass","req":"1 large tree (any), 4 pink tall grass","cond":""},{"n":167,"name":"Office storeroom","req":"1 office shelf, 1 step stool, 1 cardboard boxes","cond":""}],"Pupitar":[{"n":138,"name":"Tree-shaded pink tall grass","req":"1 large tree (any), 4 pink tall grass","cond":""}],"Froakie":[{"n":139,"name":"Hydrated pink tall grass","req":"4 pink tall grass, 2 water","cond":""}],"Frogadier":[{"n":139,"name":"Hydrated pink tall grass","req":"4 pink tall grass, 2 water","cond":""},{"n":173,"name":"Prank button","req":"1 floor switch, 1 boo-in-the-box","cond":""}],"Greninja":[{"n":139,"name":"Hydrated pink tall grass","req":"4 pink tall grass, 2 water","cond":""},{"n":173,"name":"Prank button","req":"1 floor switch, 1 boo-in-the-box","cond":""}],"Corvisquire":[{"n":140,"name":"Elevated pink tall grass","req":"4 pink tall grass, 1 high-up location","cond":""}],"Corviknight":[{"n":140,"name":"Elevated pink tall grass","req":"4 pink tall grass, 1 high-up location","cond":""},{"n":156,"name":"Sewer-hole inspection","req":"1 iron pipes, 1 sewer-hole cover, 1 excavation tools, 1 traffic cone","cond":""}],"Wattrel":[{"n":140,"name":"Elevated pink tall grass","req":"4 pink tall grass, 1 high-up location","cond":""}],"Kilowattrel":[{"n":140,"name":"Elevated pink tall grass","req":"4 pink tall grass, 1 high-up location","cond":""}],"Cyndaquil":[{"n":141,"name":"Concrete pipe secret base","req":"3 concrete pipes, 4 tall grass (any)","cond":""}],"Quilava":[{"n":141,"name":"Concrete pipe secret base","req":"3 concrete pipes, 4 tall grass (any)","cond":""},{"n":150,"name":"Fireplace nap spot","req":"1 lit stone fireplace, 1 seat (wide)","cond":""}],"Vulpix":[{"n":142,"name":"Fluffy flower bed","req":"4 skyland flowers","cond":""}],"Ninetales":[{"n":142,"name":"Fluffy flower bed","req":"4 skyland flowers","cond":""},{"n":180,"name":"Nine flames","req":"9 lit firepits","cond":""}],"Rookidee":[{"n":142,"name":"Fluffy flower bed","req":"4 skyland flowers","cond":""}],"Misdreavus":[{"n":142,"name":"Fluffy flower bed","req":"4 skyland flowers","cond":"night only"},{"n":167,"name":"Office storeroom","req":"1 office shelf, 1 step stool, 1 cardboard boxes","cond":"night only"}],"Mismagius":[{"n":142,"name":"Fluffy flower bed","req":"4 skyland flowers","cond":"night only"},{"n":158,"name":"Home theater","req":"2 speakers, 1 stand (any), 1 powered television","cond":"night only"},{"n":167,"name":"Office storeroom","req":"1 office shelf, 1 step stool, 1 cardboard boxes","cond":"night only"}],"Girafarig":[{"n":143,"name":"Tree-shaded fluffy flower bed","req":"1 large tree (any), 4 skyland flowers","cond":""}],"Farigiraf":[{"n":143,"name":"Tree-shaded fluffy flower bed","req":"1 large tree (any), 4 skyland flowers","cond":""}],"Servine":[{"n":143,"name":"Tree-shaded fluffy flower bed","req":"1 large tree (any), 4 skyland flowers","cond":""}],"Serperior":[{"n":143,"name":"Tree-shaded fluffy flower bed","req":"1 large tree (any), 4 skyland flowers","cond":""},{"n":171,"name":"Public reading material","req":"1 magazine rack, 1 newspaper","cond":""}],"Dratini":[{"n":144,"name":"Hydrated fluffy flower bed","req":"4 skyland flowers, 2 water","cond":""},{"n":148,"name":"Simple bathroom","req":"1 shower, 1 bathtub","cond":""}],"Dragonair":[{"n":144,"name":"Hydrated fluffy flower bed","req":"4 skyland flowers, 2 water","cond":""},{"n":148,"name":"Simple bathroom","req":"1 shower, 1 bathtub","cond":""}],"Poliwhirl":[{"n":144,"name":"Hydrated fluffy flower bed","req":"4 skyland flowers, 2 water","cond":""}],"Dragonite":[{"n":145,"name":"Waterside dinghy","req":"1 canoe, 2 duckweed, 2 water, 1 high-up location","cond":""}],"Gyarados":[{"n":146,"name":"Illuminated waterfall","req":"3 stepping stones, 2 lit torches, 3 water, 1 waterfall","cond":""}],"Altaria":[{"n":147,"name":"Birdsong garden","req":"1 stylish hedge, 1 wooden birdhouse","cond":""}],"Beldum":[{"n":149,"name":"Cycling rest stop","req":"1 bike, 1 powered vending machine","cond":""}],"Typhlosion":[{"n":150,"name":"Fireplace nap spot","req":"1 lit stone fireplace, 1 seat (wide)","cond":""},{"n":183,"name":"Top pop","req":"1 pop art bed, 1 pop art sofa, 1 pop art table","cond":""}],"Abra":[{"n":151,"name":"Surging psychic power","req":"1 simple cushion, 1 crystal ball","cond":""},{"n":152,"name":"Fortune-teller's table","req":"2 seats (any), 1 table (any), 1 crystal ball","cond":""}],"Alakazam":[{"n":151,"name":"Surging psychic power","req":"1 simple cushion, 1 crystal ball","cond":""},{"n":168,"name":"Experiment space","req":"1 science experiment, 1 microscope, 1 papers","cond":""}],"Kadabra":[{"n":152,"name":"Fortune-teller's table","req":"2 seats (any), 1 table (any), 1 crystal ball","cond":""}],"Dusclops":[{"n":153,"name":"Trash site TV","req":"2 garbage bags, 1 powered television","cond":"night only"}],"Dusknoir":[{"n":153,"name":"Trash site TV","req":"2 garbage bags, 1 powered television","cond":"night only"}],"Tinkmaster":[{"n":154,"name":"Oversized dumping ground","req":"3 iron beams or columns, 1 tires, 1 waste bin (any), 1 microwave oven","cond":""}],"Floragato":[{"n":155,"name":"Interrogation desk","req":"1 Arcanine doll, 2 folding chairs, 1 industrial desk, 1 lit desk light","cond":""}],"Poliwrath":[{"n":156,"name":"Sewer-hole inspection","req":"1 iron pipes, 1 sewer-hole cover, 1 excavation tools, 1 traffic cone","cond":""},{"n":178,"name":"Dojo training","req":"2 hanging scrolls, 2 strength rocks","cond":""}],"Mime Jr.":[{"n":157,"name":"Spotless washing station","req":"1 towel rack, 1 wall mirror, 1 sink","cond":""},{"n":171,"name":"Public reading material","req":"1 magazine rack, 1 newspaper","cond":""}],"Mr. Mime":[{"n":157,"name":"Spotless washing station","req":"1 towel rack, 1 wall mirror, 1 sink","cond":""}],"Ralts":[{"n":159,"name":"Study area","req":"1 bookcase, 1 seat (any), 1 table (any), 1 pencil holder","cond":""}],"Kirlia":[{"n":159,"name":"Study area","req":"1 bookcase, 1 seat (any), 1 table (any), 1 pencil holder","cond":""},{"n":162,"name":"Moisturizing makeup stand","req":"1 dresser (any), 1 seat (any), 1 humidifier","cond":""}],"Noibat":[{"n":160,"name":"Rhythmic living room","req":"2 speakers, 4 music mats (any), 1 powered television","cond":""}],"Noivern":[{"n":160,"name":"Rhythmic living room","req":"2 speakers, 4 music mats (any), 1 powered television","cond":""}],"Poliwag":[{"n":161,"name":"Squeaky clean","req":"1 bathtub, 1 cleaning supplies","cond":""}],"Gardevoir":[{"n":162,"name":"Moisturizing makeup stand","req":"1 dresser (any), 1 seat (any), 1 humidifier","cond":""},{"n":163,"name":"Mini library","req":"2 bookcases, 1 step stool, 1 table (any), 1 powered lighting (any)","cond":""}],"Porygon-Z":[{"n":164,"name":"Game Corner battle zone","req":"2 powered arcade machines, 2 seats (any)","cond":""}],"Snivy":[{"n":165,"name":"Playland","req":"1 slide, 1 toy (any)","cond":"Sparkling Skylands only"}],"Porygon2":[{"n":166,"name":"Work desk","req":"1 office desk, 1 laptop, 1 mug, 1 office chair","cond":""}],"Dragapult":[{"n":167,"name":"Office storeroom","req":"1 office shelf, 1 step stool, 1 cardboard boxes","cond":""}],"Metang":[{"n":169,"name":"Professor's apprentice program","req":"1 whiteboard, 1 table (any), 1 jumbled cords, 1 laptop","cond":""}],"Porygon":[{"n":170,"name":"Researcher's desk","req":"2 tables (any), 1 powered computer, 1 science experiment","cond":""}],"Meowscarada":[{"n":172,"name":"Heart-pounding surprise box","req":"2 lit spotlights, 1 big drum, 1 boo-in-the-box","cond":""}],"Plusle":[{"n":174,"name":"Picturesque photo cutout board","req":"1 photo cutout board, 2 powered spotlights, 1 high-up location","cond":""}],"Minun":[{"n":174,"name":"Picturesque photo cutout board","req":"1 photo cutout board, 2 powered spotlights, 1 high-up location","cond":""}],"Dedenne":[{"n":175,"name":"Tire park","req":"1 slide, 1 tires, 2 tire toys","cond":"Sparkling Skylands only"}],"Raichu":[{"n":176,"name":"Nature's market","req":"1 large tree (any), 1 large boulder, 2 tables (any), 1 powered cash register","cond":""}],"Conkeldurr":[{"n":177,"name":"Construction-site generator","req":"1 furnace, 2 iron scaffold, 1 iron pipes","cond":""}],"Gallade":[{"n":178,"name":"Dojo training","req":"2 hanging scrolls, 2 strength rocks","cond":""}],"Persian":[{"n":179,"name":"Evil organization HQ","req":"2 potted plants (any), 1 Team Rocket wall hanging, 1 luxury sofa","cond":""}],"Drifblim":[{"n":181,"name":"Plush central","req":"1 Arcanine doll, 1 Pikachu doll, 1 Dragonite doll, 1 Eevee doll","cond":""}],"Metagross":[{"n":182,"name":"Gamer's paradise","req":"1 gaming bed, 1 gaming PC, 1 gaming chair, 1 table (any), 1 gaming fridge","cond":""}],"Magikarp*":[{"n":185,"name":"Ocean fishing spot","req":"1 fishing rod, 1 seat (any), 1 ocean water","cond":""}],"W. Gastrodon*":[{"n":185,"name":"Ocean fishing spot","req":"1 fishing rod, 1 seat (any), 1 ocean water","cond":""}],"E. Gastrodon*":[{"n":185,"name":"Ocean fishing spot","req":"1 fishing rod, 1 seat (any), 1 ocean water","cond":""}],"Grimer*":[{"n":186,"name":"Marsh fishing spot","req":"1 fishing rod, 1 seat (any), 1 muddy water","cond":""}],"Muk*":[{"n":186,"name":"Marsh fishing spot","req":"1 fishing rod, 1 seat (any), 1 muddy water","cond":""}],"Amp. Toxtricity*":[{"n":189,"name":"Amped rock stage","req":"2 speakers, 1 powered small stage, 1 cool electric guitar, 1 standing mic","cond":""}],"Low. Toxtricity*":[{"n":190,"name":"Low-key rock stage","req":"2 speakers, 1 powered small stage, 1 cool bass guitar, 1 standing mic","cond":""}],"Ceruledge*":[{"n":191,"name":"Malicious knight's shrine","req":"1 pedestal/exhibition stand, 1 Malicious Armor, 2 stepping stones, 2 lit firepits","cond":""}],"Armarouge*":[{"n":192,"name":"Auspicious knight's shrine","req":"1 pedestal/exhibition stand, 1 Auspicious Armor, 2 stepping stones, 2 lit firepits","cond":""}],"Aerodactyl*":[{"n":193,"name":"Wing Fossil display","req":"1 pedestal/exhibition stand, 1 Wing Fossil (head/right wing/left wing/body/tail)","cond":""}],"Cranidos*":[{"n":194,"name":"Skull Fossil display","req":"1 pedestal/exhibition stand, 1 Skull Fossil","cond":""}],"Rampardos*":[{"n":195,"name":"Headbutt Fossil display","req":"1 pedestal/exhibition stand, 1 Headbutt Fossil (head/body/tail)","cond":""}],"Shieldon*":[{"n":196,"name":"Armor Fossil display","req":"1 pedestal/exhibition stand, 1 Armor Fossil","cond":""}],"Bastiodon*":[{"n":197,"name":"Shield Fossil display","req":"2 pedestal/exhibition stand, 1 Shield Fossil (head/body/tail)","cond":""}],"Tyrunt*":[{"n":198,"name":"Jaw Fossil display","req":"1 pedestal/exhibition stand, 1 Jaw Fossil","cond":""}],"Tyrantrum*":[{"n":199,"name":"Despot Fossil display","req":"2 pedestal/exhibition stand, 1 Despot Fossil (head/body/legs/tail)","cond":""}],"Amaura*":[{"n":200,"name":"Sail Fossil display","req":"1 pedestal/exhibition stand, 1 Sail Fossil","cond":""}],"Aurorus*":[{"n":201,"name":"Tundra Fossil display","req":"1 pedestal/exhibition stand, 1 Tundra Fossil (head/body/tail)","cond":""}],"Vaporeon":[{"n":202,"name":"Boundless beverage","req":"1 seat (any), 1 table (any), 1 soda float","cond":"Palette Town only"}],"Jolteon":[{"n":203,"name":"Electrifying potatoes","req":"1 seat (any), 1 table (any), 1 fried potatoes","cond":"Palette Town only"}],"Flareon":[{"n":204,"name":"Burning-hot spice","req":"1 seat (any), 1 table (any), 1 pizza","cond":"Palette Town only"}],"Espeon":[{"n":205,"name":"Elegant daytime treats","req":"1 seat (any), 1 table (any), 1 afternoon tea set","cond":"Palette Town only, day only"}],"Umbreon":[{"n":206,"name":"Dark-chocolate cookies","req":"1 seat (any), 1 table (any), 1 chocolate cookies","cond":"Palette Town only, night only"}],"Leafeon":[{"n":207,"name":"Leafy greens sandwich","req":"1 seat (any), 1 table (any), 1 sandwiches","cond":"Palette Town only"}],"Glaceon":[{"n":208,"name":"Chilly shaved ice","req":"1 seat (any), 1 table (any), 1 shaved ice","cond":"Palette Town only"}],"Sylveon":[{"n":209,"name":"Lovely ribbon cake","req":"1 seat (any), 1 table (any), 1 ribbon cake","cond":"Palette Town only"}]};

const SPRITE_ID = {"Bulbasaur":1,"Ivysaur":2,"Venusaur":3,"Charmander":4,"Charmeleon":5,"Charizard":6,"Squirtle":7,"Wartortle":8,"Blastoise":9,"Pidgey":16,"Pidgeotto":17,"Pidgeot":18,"Oddish":43,"Vileplume":45,"Bellossom":182,"Paras":46,"Parasect":47,"Venonat":48,"Venomoth":49,"Bellsprout":69,"Weepinbell":70,"Victreebel":71,"Slowpoke":79,"Slowbro":80,"Slowking":199,"Magnemite":81,"Onix":95,"Cubone":104,"Marowak":105,"Tyrogue":236,"Hitmonchan":107,"Hitmonlee":106,"Hitmontop":237,"Scyther":123,"Pinsir":127,"Magikarp*":129,"Hoothoot":163,"Noctowl":164,"Heracross":214,"Volbeat":313,"Illumise":314,"Gulpin":316,"Cacnea":331,"Cacturne":332,"Combee":415,"Vespiquen":416,"W. Shellos":422,"E. Shellos":422,"W. Gastrodon*":423,"E. Gastrodon*":423,"Drifloon":425,"Drilbur":529,"Excadrill":530,"Timburr":532,"Gurdurr":533,"Litwick":607,"Lampent":608,"Chandelure":609,"Axew":610,"Fraxure":611,"Haxorus":612,"Goomy":704,"Sliggoo":705,"Goodra":706,"Pichu":172,"Vikavolt":738,"Magby":240,"Gloom":44,"Magneton":82,"Magnezone":462,"Peakychu":25,"Zubat":41,"Golbat":42,"Crobat":169,"Meowth":52,"Psyduck":54,"Golduck":55,"Growlithe":58,"Farfetch'd":83,"Grimer*":88,"Muk*":89,"Gastly":92,"Haunter":93,"Gengar":94,"Voltorb":100,"Electrode":101,"Exeggcute":102,"Exeggutor":103,"Happiny":440,"Chansey":113,"Blissey":242,"Elekid":239,"Electabuzz":125,"Electivire":466,"Lapras":131,"Mosslax":143,"Spinarak":167,"Ariados":168,"Mareep":179,"Flaafy":180,"Ampharos":181,"Azurill":298,"Marill":183,"Azumarill":184,"Pal. Wooper":10253,"Clodsire":980,"Smearguru":235,"Torchic":255,"Combusken":256,"Blaziken":257,"Wingull":278,"Pelipper":279,"Makuhita":296,"Hariyama":297,"Absol":359,"Piplup":393,"Prinplup":394,"Empoleon":395,"Audino":531,"Trubbish":568,"Garbodor":569,"Zorua":570,"Zoroark":571,"Minccino":572,"Cinccino":573,"Grubbin":736,"Charjabug":737,"Pawmi":921,"Pawmo":922,"Pawmot":923,"C. Tatsugiri":978,"D. Tatsugiri":10258,"S. Tatsugiri":10259,"Steelix":208,"Swalot":317,"Arcanine":59,"Ekans":23,"Arbok":24,"Cleffa":173,"Clefairy":35,"Clefable":36,"Igglybuff":174,"Jigglypuff":39,"Wigglytuff":40,"Diglett":50,"Dugtrio":51,"Machoke":67,"Machamp":68,"Graveler":75,"Golem":76,"Magmar":126,"Magmortar":467,"Bonsly":438,"Sudowoodo":185,"Murkrow":198,"Honchkrow":430,"Larvitar":246,"Tyranitar":248,"Lotad":270,"Lombre":271,"Ludicolo":272,"Torkoal":324,"Kricketot":401,"Kricketune":402,"Chatot":441,"Riolu":447,"Lucario":448,"DJ Rotom":479,"Larvesta":636,"Volcarona":637,"Dartrix":723,"Decidueye":724,"Scorbunny":813,"Raboot":814,"Cinderace":815,"Chef Greedent":820,"Rolycoly":837,"Coalossal":839,"Toxel":848,"Amp. Toxtricity*":849,"Low. Toxtricity*":10184,"Fidough":926,"Dachsbun":927,"Charcadet":935,"Ceruledge*":937,"Armarouge*":936,"Glimmet":969,"Glimmora":970,"Gimmighoul":999,"Gholdengo":1000,"Politoed":186,"Aerodactyl*":142,"Cranidos*":408,"Rampardos*":409,"Shieldon*":410,"Bastiodon*":411,"Tyrunt*":696,"Tyrantrum*":697,"Amaura*":698,"Aurorus*":699,"Gyarados":130,"Drifblim":426,"Conkeldurr":534,"Raichu":26,"Persian":53,"Pupitar":247,"Vulpix":37,"Ninetales":38,"Poliwag":60,"Poliwhirl":61,"Poliwrath":62,"Abra":63,"Kadabra":64,"Alakazam":65,"Mime Jr.":439,"Mr. Mime":122,"Porygon":137,"Porygon2":233,"Porygon-Z":474,"Dratini":147,"Dragonair":148,"Dragonite":149,"Cyndaquil":155,"Quilava":156,"Typhlosion":157,"Misdreavus":200,"Mismagius":429,"Girafarig":203,"Farigiraf":981,"Ralts":280,"Kirlia":281,"Gardevoir":282,"Gallade":475,"Plusle":311,"Minun":312,"Trapinch":328,"Vibrava":329,"Flygon":330,"Swablu":333,"Altaria":334,"Duskull":355,"Dusclops":356,"Dusknoir":477,"Beldum":374,"Metang":375,"Metagross":376,"Snivy":495,"Servine":496,"Serperior":497,"Froakie":656,"Frogadier":657,"Greninja":658,"Dedenne":702,"Noibat":714,"Noivern":715,"Rookidee":821,"Corvisquire":822,"Corviknight":823,"Dreepy":885,"Drakloak":886,"Dragapult":887,"Sprigatito":906,"Floragato":907,"Meowscarada":908,"Wattrel":940,"Kilowattrel":941,"Tinkmaster":959,"Koffing":109,"Weezing":110,"Tangela":114,"Scizor":212,"Cramorant":845,"Pikachu":25,"Munchlax":446,"Snorlax":143,"Machop":66,"Geodude":74,"Mawile":303,"Rowlet":722,"Skwovet":819,"Tinkatink":957,"Tinkatuff":958,"Eevee":133,"Vaporeon":134,"Jolteon":135,"Flareon":136,"Espeon":196,"Umbreon":197,"Leafeon":470,"Glaceon":471,"Sylveon":700,"Hoppip":187,"Skiploom":188,"Jumpluff":189,"Sableye":302,"Tangrowth":465,"Kyogre":382,"Raikou":243,"Entei":244,"Suicune":245,"Volcanion":721,"Articuno":144,"Zapdos":145,"Moltres":146,"Lugia":249,"Ho-oh":250,"Mewtwo":150,"Mew":151,"Mimikyu":778,"Carkoal":838};

const IMG_BASE = "https://pokopia.gamertw.com/images/habitats";
const HAB_IMG = (n) => `${IMG_BASE}/HAB-${String(n).padStart(3, "0")}.png`;
const SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
const SPRITE_URL = (m) => SPRITE_ID[m] ? `${SPRITE_BASE}/${SPRITE_ID[m]}.png` : null;

const AREAS = [
  { key:"WASTELAND", name:"Withered Wasteland", short:"Wasteland", accent:"#B9743A", tint:"#F4E9DA",
    mon:["Bulbasaur","Ivysaur","Venusaur","Charmander","Charmeleon","Charizard","Squirtle","Wartortle","Blastoise","Pidgey","Pidgeotto","Pidgeot","Oddish","Vileplume","Bellossom","Paras","Parasect","Venonat","Venomoth","Bellsprout","Weepinbell","Victreebel","Slowpoke","Slowbro","Slowking","Magnemite","Onix","Cubone","Marowak","Tyrogue","Hitmonchan","Hitmonlee","Hitmontop","Scyther","Pinsir","Magikarp*","Hoothoot","Noctowl","Heracross","Volbeat","Illumise","Gulpin","Cacnea","Cacturne","Combee","Vespiquen","W. Shellos","E. Shellos","W. Gastrodon*","E. Gastrodon*","Drifloon","Drilbur","Excadrill","Timburr","Gurdurr","Litwick","Lampent","Chandelure","Axew","Fraxure","Haxorus","Goomy","Sliggoo","Goodra","Pichu","Vikavolt","Magby"] },
  { key:"BEACH", name:"Bleak Beach", short:"Beach", accent:"#1E9AAE", tint:"#DCF0F1",
    mon:["Gloom","Magneton","Magnezone","Peakychu","Zubat","Golbat","Crobat","Meowth","Psyduck","Golduck","Growlithe","Farfetch'd","Grimer*","Muk*","Gastly","Haunter","Gengar","Voltorb","Electrode","Exeggcute","Exeggutor","Happiny","Chansey","Blissey","Elekid","Electabuzz","Electivire","Lapras","Mosslax","Spinarak","Ariados","Mareep","Flaafy","Ampharos","Azurill","Marill","Azumarill","Pal. Wooper","Clodsire","Smearguru","Torchic","Combusken","Blaziken","Wingull","Pelipper","Makuhita","Hariyama","Absol","Piplup","Prinplup","Empoleon","Audino","Trubbish","Garbodor","Zorua","Zoroark","Minccino","Cinccino","Grubbin","Charjabug","Mimikyu","Pawmi","Pawmo","Pawmot","C. Tatsugiri","D. Tatsugiri","S. Tatsugiri"] },
  { key:"RIDGE", name:"Rocky Ridge", short:"Ridge", accent:"#9A5C3E", tint:"#EDE1D8",
    mon:["Steelix","Swalot","Arcanine","Ekans","Arbok","Cleffa","Clefairy","Clefable","Igglybuff","Jigglypuff","Wigglytuff","Diglett","Dugtrio","Machoke","Machamp","Graveler","Golem","Magmar","Magmortar","Bonsly","Sudowoodo","Murkrow","Honchkrow","Larvitar","Tyranitar","Lotad","Lombre","Ludicolo","Torkoal","Kricketot","Kricketune","Chatot","Riolu","Lucario","DJ Rotom","Larvesta","Volcarona","Dartrix","Decidueye","Scorbunny","Raboot","Cinderace","Chef Greedent","Rolycoly","Carkoal","Coalossal","Toxel","Amp. Toxtricity*","Low. Toxtricity*","Fidough","Dachsbun","Charcadet","Ceruledge*","Armarouge*","Glimmet","Glimmora","Gimmighoul","Gholdengo","Politoed","Aerodactyl*","Cranidos*","Rampardos*","Shieldon*","Bastiodon*","Tyrunt*","Tyrantrum*","Amaura*","Aurorus*"] },
  { key:"SKYLANDS", name:"Sparkling Skylands", short:"Skylands", accent:"#6E68CE", tint:"#E7E5FA",
    mon:["Gyarados","Drifblim","Conkeldurr","Raichu","Persian","Pupitar","Vulpix","Ninetales","Poliwag","Poliwhirl","Poliwrath","Abra","Kadabra","Alakazam","Mime Jr.","Mr. Mime","Porygon","Porygon2","Porygon-Z","Dratini","Dragonair","Dragonite","Cyndaquil","Quilava","Typhlosion","Misdreavus","Mismagius","Girafarig","Farigiraf","Ralts","Kirlia","Gardevoir","Gallade","Plusle","Minun","Trapinch","Vibrava","Flygon","Swablu","Altaria","Duskull","Dusclops","Dusknoir","Beldum","Metang","Metagross","Snivy","Servine","Serperior","Froakie","Frogadier","Greninja","Dedenne","Noibat","Noivern","Rookidee","Corvisquire","Corviknight","Dreepy","Drakloak","Dragapult","Sprigatito","Floragato","Meowscarada","Wattrel","Kilowattrel","Tinkmaster"] },
  { key:"TOWN", name:"Palette Town", short:"Town", accent:"#3E9A60", tint:"#E0F1E5",
    mon:["Koffing","Weezing","Tangela","Scizor","Cramorant","Pikachu","Munchlax","Snorlax","Machop","Geodude","Mawile","Rowlet","Skwovet","Tinkatink","Tinkatuff","Eevee","Vaporeon","Jolteon","Flareon","Espeon","Umbreon","Leafeon","Glaceon","Sylveon"] },
  { key:"CLOUD", name:"Cloud Islands", short:"Cloud", accent:"#5689AE", tint:"#E5EEF4", mon:["Tangrowth"] },
  { key:"EVENT", name:"Event", short:"Event", accent:"#BC4F96", tint:"#F6E2F0", special:true, mon:["Hoppip","Skiploom","Jumpluff","Sableye"] },
  { key:"LEGENDS", name:"Legends & Mythicals", short:"Legends", accent:"#9663C2", tint:"#EEE5F6", special:true, mon:["Kyogre","Raikou","Entei","Suicune","Volcanion","Articuno","Zapdos","Moltres","Lugia","Ho-oh","Mewtwo","Mew"] },
];
const TOTAL = AREAS.reduce((s,a)=>s+a.mon.length,0);
const AREA_OF = {}; AREAS.forEach(a=>a.mon.forEach(m=>{AREA_OF[m]=a.key;}));
const AREA_BY = {}; AREAS.forEach(a=>{AREA_BY[a.key]=a;});

const HAB_INFO={}, HAB_SPAWNS={};
for (const m of Object.keys(HABITAT_DATA)) for (const h of HABITAT_DATA[m]) {
  HAB_INFO[h.n]={name:h.name, req:h.req};
  (HAB_SPAWNS[h.n]=HAB_SPAWNS[h.n]||[]).push({mon:m, cond:h.cond});
}
const HAB_AREA={};
for (const n of Object.keys(HAB_SPAWNS)) {
  const c={}; for (const s of HAB_SPAWNS[n]){ const a=AREA_OF[s.mon]; if(a) c[a]=(c[a]||0)+1; }
  let best="WASTELAND",bc=-1; for (const a of AREAS){ const v=c[a.key]||0; if(v>bc){bc=v;best=a.key;} }
  HAB_AREA[n]=best;
}

const SPEC_DATA = {"Appraise": ["Tangrowth"], "Build": ["Cubone", "Pinsir", "Heracross", "Timburr", "Gurdurr", "Conkeldurr", "Farfetch'd", "Azumarill", "Combusken", "Makuhita", "Hariyama", "Machop", "Machoke", "Machamp", "Riolu", "Lucario", "Politoed", "Mr. Mime", "Tinkmaster", "Marowak", "Gallade", "Tinkatink", "Tinkatuff"], "Bulldoze": ["Onix", "Munchlax", "Snorlax", "Clodsire", "Makuhita", "Hariyama", "Bonsly", "Larvitar", "Pupitar", "Trapinch", "Vibrava", "Flygon", "Steelix", "Tyranitar"], "Burn": ["Charmander", "Charmeleon", "Charizard", "Litwick", "Lampent", "Growlithe", "Arcanine", "Torchic", "Combusken", "Blaziken", "Magby", "Magmar", "Torkoal", "Scorbunny", "Raboot", "Rolycoly", "Carkoal", "Charcadet", "Ceruledge*", "Vulpix", "Ninetales", "Cyndaquil", "Quilava", "Flareon", "Volcanion", "Chandelure", "Magmortar", "Larvesta", "Volcarona", "Coalossal", "Entei"], "Crush": ["Onix", "Conkeldurr", "Pawmo", "Pawmi", "Pawmot", "Dugtrio", "Geodude", "Graveler", "Golem", "Larvitar", "Pupitar", "Tyrantrum*", "Amaura*", "Electivire", "Steelix", "Magmortar", "Tyranitar", "Cranidos*", "Rampardos*", "Shieldon*", "Bastiodon*", "Tyrunt*", "Aurorus*", "Metagross"], "Chop": ["Scyther", "Scizor", "Heracross", "Pinsir", "Victreebel", "Crobat", "Farfetch'd", "Zoroark", "Grubbin", "Vikavolt", "Dartrix", "Decidueye", "Greninja", "Rookidee", "Corvisquire", "Axew", "Fraxure", "Haxorus", "Absol", "Charjabug", "Corviknight"], "Collect": ["Gimmighoul", "Gholdengo"], "Dream Island": ["Drifloon"], "DJ": ["DJ Rotom"], "Engineer": ["Tinkmaster"], "Explode": ["Voltorb", "Electrode"], "Fly": ["Charizard", "Pidgey", "Pidgeotto", "Pidgeot", "Cramorant", "Wingull", "Murkrow", "Honchkrow", "Chatot", "Dragonite", "Vibrava", "Flygon", "Altaria", "Aerodactyl*", "Drifblim", "Noivern", "Corviknight", "Articuno", "Zapdos", "Moltres"], "Gather": ["Minccino", "Cinccino", "Gastly", "Machop", "Machoke", "Machamp", "Rolycoly", "Carkoal", "Mr. Mime", "Mismagius", "Girafarig", "Duskull", "Dusknoir", "Dreepy", "Drakloak", "Dragapult", "Espeon", "Coalossal", "Drifblim", "Mime Jr.", "Farigiraf", "Dusclops"], "Gather Honey": ["Vespiquen"], "Generate": ["Raichu", "Magnemite", "Magneton", "Magnezone", "Voltorb", "Electrode", "Elekid", "Mareep", "Flaafy", "Vikavolt", "Wattrel", "Kilowattrel", "Pawmi", "Pawmo", "Pawmot", "Jolteon", "Raikou", "Pichu", "Electabuzz", "Electivire", "Ampharos", "Charjabug", "Toxel", "Amp. Toxtricity*", "Low. Toxtricity*", "Plusle", "Minun", "Pikachu"], "Grow": ["Bulbasaur", "Ivysaur", "Venusaur", "Oddish", "Gloom", "Vileplume", "Bellossom", "Bellsprout", "Weepinbell", "Victreebel", "Cacturne", "Exeggcute", "Exeggutor", "Rowlet", "Dartrix", "Decidueye", "Snivy", "Servine", "Serperior", "Sprigatito", "Floragato", "Leafeon", "Cacnea", "Tangela"], "Hype": ["Bellossom", "Illumise", "Volbeat", "Raichu", "Azurill", "Marill", "Cleffa", "Clefable", "Clefairy", "Igglybuff", "Wigglytuff", "Jigglypuff", "Diglett", "Dugtrio", "Ludicolo", "Kricketot", "Kricketune", "Chatot", "Cinderace", "Skwovet", "Politoed", "Meowscarada", "Sylveon", "Amp. Toxtricity*", "Low. Toxtricity*"], "Illuminate": ["Peakychu"], "Paint": ["Smearguru"], "Litter": ["Venusaur", "Bellsprout", "Weepinbell", "Cacturne", "Combee", "Grimer*", "Muk*", "Mareep", "Flaafy", "Spinarak", "Ariados", "Pal. Wooper", "Clodsire", "Glimmet", "Trapinch", "Swablu", "Altaria", "Snivy", "Tyrantrum*", "Haxorus", "Larvesta", "Volcarona", "Glimmora", "Rampardos*", "Bastiodon*", "Aurorus*", "Tangela"], "Party": ["Chef Greedent"], "Recycle": ["Trubbish", "Garbodor", "Cinccino", "Porygon", "Metang", "Porygon2", "Beldum", "Metagross", "Koffing", "Weezing"], "Search": ["Pidgey", "Pidgeotto", "Pidgeot", "Paras", "Parasect", "Venonat", "Venomoth", "Vespiquen", "Drilbur", "Excadrill", "Zubat", "Golbat", "Crobat", "Persian", "Psyduck", "Golduck", "Growlithe", "Arcanine", "Fidough", "Dachsbun", "Dreepy", "Drakloak", "Umbreon", "Ekans", "Arbok", "Farigiraf", "Dedenne", "Noibat", "Noivern"], "Teleport": ["Slowking", "Exeggcute", "Exeggutor", "Abra", "Kadabra", "Alakazam", "Ralts", "Kirlia", "Gardevoir", "Mewtwo", "Mew", "Gallade"], "Trade": ["Blastoise", "Slowbro", "Tyrogue", "Hitmonlee", "Hitmonchan", "Hitmontop", "Hoothoot", "Noctowl", "W. Gastrodon*", "E. Gastrodon*", "Meowth", "Persian", "Gastly", "Haunter", "Gengar", "Happiny", "Chansey", "Blissey", "Snorlax", "Prinplup", "Empoleon", "Audino", "Zorua", "Zoroark", "Clefable", "Golem", "Sudowoodo", "Murkrow", "Honchkrow", "Mawile", "Dachsbun", "Armarouge*", "Ceruledge*", "Alakazam", "Typhlosion", "Misdreavus", "Mismagius", "Gardevoir", "Dusknoir", "Dragapult", "Eevee", "Glaceon", "Ampharos", "Mimikyu", "C. Tatsugiri", "D. Tatsugiri", "S. Tatsugiri"], "Transform": [], "Water": ["Squirtle", "Wartortle", "Blastoise", "Slowpoke", "Slowbro", "Slowking", "Gyarados", "W. Shellos", "E. Shellos", "W. Gastrodon*", "E. Gastrodon*", "Goomy", "Sliggoo", "Goodra", "Cramorant", "Lapras", "Azurill", "Marill", "Azumarill", "Wingull", "Pelipper", "Piplup", "Prinplup", "Empoleon", "Lotad", "Lombre", "Ludicolo", "Politoed", "Poliwhirl", "Poliwrath", "Dratini", "Dragonair", "Dragonite", "Froakie", "Frogadier", "Greninja", "Vaporeon", "Poliwag", "Suicune"], "Yawn": ["Slowpoke"], "Storage": ["Gulpin", "Swalot"], "Eat": ["Mosslax"], "Rarify": ["Porygon-Z"]};

const SPEC_META={
"Appraise":{e:"\u{1F50E}",d:"Appraises Lost Relics (rare furniture)."},
"Build":{e:"\u{1F528}",d:"Builds structures and large pieces from blueprints."},
"Bulldoze":{e:"\u{1F69C}",d:"Knocks down, moves, or rebuilds structures."},
"Burn":{e:"\u{1F525}",d:"Lights fires and burns flammable items."},
"Crush":{e:"\u26CF\uFE0F",d:"Breaks materials down into new ones."},
"Chop":{e:"\u{1FA93}",d:"Turns small logs into lumber."},
"Collect":{e:"\u{1FA99}",d:"Trades rare items for currency or requests."},
"Dream Island":{e:"\u{1F4AD}",d:"Reaches Dream Island."},
"DJ":{e:"\u{1F3A7}",d:"Plays CDs found around the world."},
"Engineer":{e:"\u{1F527}",d:"Operates machines and advanced builds."},
"Explode":{e:"\u{1F4A5}",d:"Blows up rocks and obstacles."},
"Fly":{e:"\u{1F54A}\uFE0F",d:"Carries you between landing pads."},
"Gather":{e:"\u{1F9FA}",d:"Collects items into Community Boxes on its own."},
"Gather Honey":{e:"\u{1F36F}",d:"Produces honey for crafting and cooking."},
"Generate":{e:"\u26A1",d:"Powers lamps, machines, and generators."},
"Grow":{e:"\u{1F331}",d:"Speeds up crop and plant growth."},
"Hype":{e:"\u{1F4E3}",d:"Livens up town events and gatherings."},
"Illuminate":{e:"\u{1F4A1}",d:"Lights up dark areas."},
"Paint":{e:"\u{1F3A8}",d:"Paints and customizes buildings."},
"Litter":{e:"\u{1F5D1}\uFE0F",d:"Drops extra materials as it wanders."},
"Party":{e:"\u{1F389}",d:"Hosts cooking feasts."},
"Recycle":{e:"\u267B\uFE0F",d:"Converts trash into materials (glass\u2192iron, paper)."},
"Search":{e:"\u{1F50D}",d:"Digs up buried items."},
"Teleport":{e:"\u2728",d:"Warps instantly to places you've visited."},
"Trade":{e:"\u{1F4B0}",d:"Trades at the register."},
"Transform":{e:"\u{1F300}",d:"Mimics other Pok\u00e9mon."},
"Water":{e:"\u{1F4A7}",d:"Waters plants and manages humidity."},
"Yawn":{e:"\u{1F634}",d:"Reports how humid a biome is."},
"Storage":{e:"\u{1F4E6}",d:"Acts as a mobile storage chest (carries item stacks)."},
"Eat":{e:"\u{1F37D}\uFE0F",d:"Feed it snacks for benefits and events."},
"Rarify":{e:"\u{1F48E}",d:"Turns a Star Piece into a Rare Pok\u00e9metal for the 3D Printer."},
};
const SPEC_ORDER=["Appraise", "Build", "Bulldoze", "Burn", "Crush", "Chop", "Collect", "Dream Island", "DJ", "Eat", "Engineer", "Explode", "Fly", "Gather", "Gather Honey", "Generate", "Grow", "Hype", "Illuminate", "Paint", "Litter", "Party", "Rarify", "Recycle", "Search", "Storage", "Teleport", "Trade", "Transform", "Water", "Yawn"];

const VERSION="v5.2.1", BUILD="2026-07-07";
const V5="pokopia:tracker:v5", V4="pokopia:tracker:v4", V3="pokopia:tracker:v3", V2="pokopia:tracker:v2", V1="pokopia:tracker";
function boardAreaFor(mon){ const a=AREA_OF[mon]; return AREA_BY[a] && !AREA_BY[a].special ? a : null; }
function v3ToV4(v3){ const built={},place={},extra={}; const habs=v3.habitats||{};
  for(const n of Object.keys(habs)){ built[n]=HAB_AREA[n]||"WASTELAND"; const o=habs[n].occupant; if(habs[n].status==="occupied"&&o) place[o]={t:"h",n:+n}; }
  for(const m of Object.keys(v3.befriended||{})){ if(place[m])continue; const ba=boardAreaFor(m); if(ba)place[m]={t:"house",a:ba}; else extra[m]=true; }
  return {built,place,extra}; }
function v2ToV4(v2){ const built={},place={},extra={};
  for(const m of Object.keys(v2.befriended||{})){ const r=v2.befriended[m];
    if(r&&typeof r==="object"&&r.home==="habitat"&&r.hab!=null){ built[r.hab]=HAB_AREA[r.hab]||"WASTELAND"; place[m]={t:"h",n:+r.hab}; }
    else { const ba=boardAreaFor(m); if(ba)place[m]={t:"house",a:ba}; else extra[m]=true; } }
  return {built,place,extra}; }
function v1ToV4(v1){ const place={},extra={};
  for(const m of Object.keys(v1.befriended||{})){ const ba=boardAreaFor(m); if(ba)place[m]={t:"house",a:ba}; else extra[m]=true; }
  return {built:{},place,extra}; }
function v4ToV5(v4){ let seq=1; const insts={},place={},extra={...(v4.extra||{})}; const habToId={};
  for(const habN of Object.keys(v4.built||{})){ const id="i"+seq; seq++; insts[id]={hab:+habN, area:v4.built[habN]}; habToId[String(habN)]=id; }
  for(const m of Object.keys(v4.place||{})){ const p=v4.place[m];
    if(p.t==="h"){ const id=habToId[String(p.n)]; if(id) place[m]={t:"h",i:id}; else place[m]={t:"house",a:HAB_AREA[p.n]||"WASTELAND"}; }
    else place[m]=p; }
  return {seq,insts,place,extra}; }
const EMPTY={seq:1,insts:{},place:{},extra:{}};

async function getKey(k){ try{ if(window.storage){ const r=await window.storage.get(k); if(r&&r.value) return JSON.parse(r.value);} }catch(e){} return null; }
async function loadState(){
  const v5=await getKey(V5); if(v5) return {seq:v5.seq||1, insts:v5.insts||{}, place:v5.place||{}, extra:v5.extra||{}};
  const v4=await getKey(V4); if(v4) return v4ToV5(v4);
  const v3=await getKey(V3); if(v3) return v4ToV5(v3ToV4(v3));
  const v2=await getKey(V2); if(v2&&v2.befriended) return v4ToV5(v2ToV4(v2));
  const v1=await getKey(V1); if(v1&&v1.befriended) return v4ToV5(v1ToV4(v1));
  return {...EMPTY};
}
async function saveState(s){ try{ if(window.storage) await window.storage.set(V5, JSON.stringify(s)); }catch(e){} }

export default function PokopiaTracker(){
  const [st,setSt]=useState(EMPTY);
  const [loaded,setLoaded]=useState(false);
  const [area,setArea]=useState("WASTELAND");
  const [recsOpen,setRecsOpen]=useState(true);
  const [sheet,setSheet]=useState(null);
  const [pQuery,setPQuery]=useState("");
  const [showAll,setShowAll]=useState({});
  const [view,setView]=useState("island");
  const [specScope,setSpecScope]=useState("area");
  const importRef=useRef();
  const {insts,place,extra}=st;

  useEffect(()=>{ loadState().then(s=>{ setSt(s); setLoaded(true); }); },[]);
  useEffect(()=>{ if(loaded) saveState(st); },[st,loaded]);
  useEffect(()=>{ setPQuery(""); },[sheet]);

  const isBef=(m)=> !!place[m] || !!extra[m];
  const occByInst=useMemo(()=>{ const o={}; for(const m of Object.keys(place)){ const p=place[m]; if(p.t==="h") o[p.i]=m; } return o; },[place]);
  const total=Object.keys(place).length+Object.keys(extra).length;
  const pct=Math.round(total/TOTAL*100);

  /* ---- mutations (single atomic state) ---- */
  const addInstance=(habN,areaKey)=> setSt(s=>{ const id="i"+s.seq; return {...s, seq:s.seq+1, insts:{...s.insts,[id]:{hab:+habN,area:areaKey}}}; });
  const removeInstance=(id)=> setSt(s=>{ const place={...s.place}; const occ=Object.keys(place).find(m=>place[m].t==="h"&&place[m].i===id); if(occ) place[occ]={t:"house",a:s.insts[id]?s.insts[id].area:"WASTELAND"}; const insts={...s.insts}; delete insts[id]; return {...s,insts,place}; });
  const setOccupant=(id,mon)=> setSt(s=>{ const place={...s.place}; const prev=Object.keys(place).find(m=>place[m].t==="h"&&place[m].i===id); if(prev&&prev!==mon) place[prev]={t:"house",a:s.insts[id].area}; place[mon]={t:"h",i:id}; return {...s,place}; });
  const clearOccupant=(id)=> setSt(s=>{ const place={...s.place}; const occ=Object.keys(place).find(m=>place[m].t==="h"&&place[m].i===id); if(occ) place[occ]={t:"house",a:s.insts[id].area}; return {...s,place}; });
  const addHouse=(mon,areaKey)=> setSt(s=>({...s, place:{...s.place,[mon]:{t:"house",a:areaKey}}}));
  const moveToInstance=(mon,id)=> setSt(s=>{ const place={...s.place}; const prev=Object.keys(place).find(m=>place[m].t==="h"&&place[m].i===id); if(prev&&prev!==mon) place[prev]={t:"house",a:s.insts[id].area}; place[mon]={t:"h",i:id}; return {...s,place}; });
  const buildAndOccupy=(habN,mon,areaKey)=> setSt(s=>{
    const occOf=(id)=> Object.keys(s.place).find(m=>s.place[m].t==="h"&&s.place[m].i===id);
    let targetId=Object.keys(s.insts).find(id=> s.insts[id].hab===+habN && s.insts[id].area===areaKey && !occOf(id));
    let seq=s.seq, insts=s.insts, place={...s.place};
    if(!targetId){ targetId="i"+seq; seq=seq+1; insts={...s.insts,[targetId]:{hab:+habN,area:areaKey}}; }
    place[mon]={t:"h",i:targetId};
    return {...s, seq, insts, place};
  });
  const unplace=(mon)=> setSt(s=>{ const place={...s.place}; delete place[mon]; return {...s,place}; });
  const toggleExtra=(mon)=> setSt(s=>{ const extra={...s.extra}; if(extra[mon]) delete extra[mon]; else extra[mon]=true; return {...s,extra}; });
  const resetAll=()=>{ if(typeof confirm!=="undefined" && !confirm("Wipe ALL your logged data and start over? This can't be undone.")) return;
    setSt({...EMPTY});
    try{ if(window.storage&&window.storage.delete){ [V4,V3,V2,V1].forEach(k=>window.storage.delete(k)); } }catch(e){} };

  /* ---- recommendations (instance-aware, scoped to area) ---- */
  const recs=useMemo(()=>{
    const emptyReady=[], freeSlot=[], build=[];
    const areaIds=Object.keys(insts).filter(id=>insts[id].area===area);
    const emptyTypes=new Set(); const typeCount={};
    for(const id of areaIds){ const t=insts[id].hab; typeCount[t]=(typeCount[t]||0)+1; if(!occByInst[id]) emptyTypes.add(t); }
    for(const t of emptyTypes){ const miss=(HAB_SPAWNS[t]||[]).filter(s=>!isBef(s.mon)).map(s=>s.mon); if(miss.length) emptyReady.push({n:+t,miss}); }
    for(const id of areaIds){ const occ=occByInst[id]; if(!occ) continue; const t=insts[id].hab; const miss=(HAB_SPAWNS[t]||[]).filter(s=>!isBef(s.mon)).map(s=>s.mon); if(miss.length) freeSlot.push({n:+t,occ,miss,id}); }
    for(const n of Object.keys(HAB_INFO)){ if(HAB_AREA[n]!==area) continue; if(emptyTypes.has(+n)) continue; const miss=(HAB_SPAWNS[n]||[]).filter(s=>!isBef(s.mon)).map(s=>s.mon); if(miss.length) build.push({n:+n,miss,another:(typeCount[n]||0)>0}); }
    const by=(a,b)=>b.miss.length-a.miss.length||a.n-b.n;
    emptyReady.sort(by); freeSlot.sort(by); build.sort(by);
    return {emptyReady,freeSlot,build};
  },[insts,place,extra,occByInst,area]);

  const exportProgress=()=>{ try{ const blob=new Blob([JSON.stringify(st,null,2)],{type:"application/json"}); const u=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=u; a.download="pokopia-progress.json"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(u);}catch(e){} };
  const importProgress=(e)=>{ const f=e.target.files&&e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ const d=JSON.parse(r.result);
      if(d.insts){ setSt({seq:d.seq||1,insts:d.insts||{},place:d.place||{},extra:d.extra||{}}); }
      else if(d.built){ setSt(v4ToV5(d)); }
      else if(d.befriended){ setSt(v4ToV5(v3ToV4(d))); }
    }catch(err){ if(typeof alert!=="undefined") alert("Couldn't read that file."); } }; r.readAsText(f); e.target.value=""; };

  if(!loaded) return (<div style={S.page}><style>{CSS}</style><div style={{...S.shell,textAlign:"center",paddingTop:80,color:"#7d8a7e"}}>Loading your island…</div></div>);

  const A=AREA_BY[area];
  const monsInArea=(a)=>{ if(AREA_BY[a].special) return AREA_BY[a].mon.filter(m=>extra[m]);
    const out=[]; for(const m of Object.keys(place)){ const p=place[m]; if(p.t==="h"&&insts[p.i]&&insts[p.i].area===a) out.push(m); else if(p.t==="house"&&p.a===a) out.push(m); } return out; };
  const areaIds=Object.keys(insts).filter(id=>insts[id].area===area).sort((a,b)=> insts[a].hab-insts[b].hab || (a<b?-1:1));
  const areaHouses=Object.keys(place).filter(m=>place[m].t==="house"&&place[m].a===area);
  const placedSet=new Set(Object.keys(place));
  const recPalette=A.special? A.mon.filter(m=>!isBef(m)) : A.mon.filter(m=>!placedSet.has(m));
  const countByHab=(habN)=> Object.keys(insts).filter(id=>insts[id].hab===+habN).length;

  return (
    <div style={S.page}>
      <style>{CSS}</style>
      <div style={S.shell}>
        <header style={S.header}>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <Sprout size={28} color="#3E9A60" strokeWidth={2.4}/>
            <h1 style={S.h1}>Pokopia Tracker</h1>
            <span style={S.ver} title={"Build "+BUILD}>{VERSION}</span>
            <button style={S.iconBtn} onClick={exportProgress} title="Export"><Download size={15}/></button>
            <button style={S.iconBtn} onClick={()=>importRef.current&&importRef.current.click()} title="Import"><Upload size={15}/></button>
            <input ref={importRef} type="file" accept="application/json,.json" style={{display:"none"}} onChange={importProgress}/>
            <button style={{...S.iconBtn,color:"#b04a3a",borderColor:"#f0d6d0"}} onClick={resetAll} title="Reset all data"><Trash2 size={15}/></button>
          </div>
          <div style={S.progressWrap}>
            <div style={S.progressTop}>
              <span style={{fontWeight:700}}>{total}</span><span style={{color:"#7d8a7e"}}> / {TOTAL} befriended</span>
              <span style={S.pctPill}>{pct}%</span>
              <span style={S.habStat}><Hammer size={12}/> {Object.keys(insts).length} built</span>
            </div>
            <div style={S.bar}><div style={{...S.barFill,width:`${pct}%`}}/></div>
          </div>
        </header>

        <section style={S.recCard}>
          <button style={S.recHead} onClick={()=>setRecsOpen(o=>!o)}>
            <span style={{display:"flex",alignItems:"center",gap:8}}><Target size={18} color="#3E9A60"/><span style={S.recTitle}>Next up</span>
              <span style={S.recSub}>in {A.short}{A.special?"":` · ${recs.emptyReady.length} ready · ${recs.freeSlot.length} free · ${recs.build.length} build`}</span></span>
            {recsOpen? <ChevronDown size={18} color="#8a958b"/> : <ChevronRight size={18} color="#8a958b"/>}
          </button>
          {recsOpen && (A.special ? (<div style={{padding:"2px 14px 14px"}}>
            <div style={S.recEmpty}>{A.name} Pokémon come from events / special encounters, not habitats — nothing to build here.</div>
          </div>) : <div style={{padding:"2px 14px 14px"}}>
            <RecGroup icon={<Clock size={14} color="#1E9AAE"/>} label="Empty & ready — built, open, still has something you need"
              rows={recs.emptyReady} all={showAll.r} more={()=>setShowAll(s=>({...s,r:!s.r}))} empty="No open habitats with anything new."
              render={(r)=><MoveLine n={r.n} miss={r.miss} kind="ready"/>}/>
            <RecGroup icon={<Home size={14} color="#B9743A"/>} label="Free a slot — occupied, but still has missing species"
              rows={recs.freeSlot} all={showAll.f} more={()=>setShowAll(s=>({...s,f:!s.f}))} empty="Nothing worth clearing yet."
              render={(r)=><MoveLine n={r.n} miss={r.miss} kind="free" occ={r.occ}/>}/>
            <RecGroup icon={<Hammer size={14} color="#3E9A60"/>} label="Build next — most new Pokémon per habitat"
              rows={recs.build} all={showAll.b} more={()=>setShowAll(s=>({...s,b:!s.b}))} empty="Everything worth building is built."
              render={(r)=><BuildLine n={r.n} miss={r.miss} another={r.another}/>}/>
          </div>)}
        </section>

        <div style={S.pills}>
          {AREAS.map(a=>(
            <button key={a.key} onClick={()=>setArea(a.key)}
              style={{...S.pill,...(area===a.key?{background:a.accent,color:"#fff",borderColor:a.accent}:{color:a.accent,borderColor:a.accent+"55"})}}>{a.short}</button>
          ))}
        </div>

        <div style={S.viewToggle}>
          <button style={{...S.vtBtn,...(view==="island"?S.vtOn:{})}} onClick={()=>setView("island")}>Island</button>
          <button style={{...S.vtBtn,...(view==="specialties"?S.vtOn:{})}} onClick={()=>setView("specialties")}>Specialties</button>
        </div>

        {view==="specialties" ? (
          <section style={{...S.section,background:A.tint,borderColor:A.accent+"33"}}>
            <div style={{...S.areaTitle,color:A.accent}}>Specialties</div>
            <div style={S.scopeRow}>
              <button style={{...S.scopeBtn,...(specScope==="area"?S.scopeOn:{})}} onClick={()=>setSpecScope("area")}>{A.short}</button>
              <button style={{...S.scopeBtn,...(specScope==="island"?S.scopeOn:{})}} onClick={()=>setSpecScope("island")}>Whole island</button>
            </div>
            {(()=>{
              const mons = specScope==="island" ? [...Object.keys(place),...Object.keys(extra)] : monsInArea(area);
              const monSet=new Set(mons);
              const covered=[], missing=[];
              for(const s of SPEC_ORDER){ const who=(SPEC_DATA[s]||[]).filter(m=>monSet.has(m)); if(who.length) covered.push([s,who]); else missing.push(s); }
              return (<React.Fragment>
                <div style={S.subtle}>{covered.length} of {SPEC_ORDER.length} specialties covered {specScope==="area"?("in "+A.short):"on your island"}.</div>
                {covered.length===0 && <div style={S.recEmpty}>No specialties yet — register some Pok\u00e9mon {specScope==="area"?"here":""} first.</div>}
                {covered.map(([s,who])=>(
                  <div key={s} style={S.specCard}>
                    <div style={S.specHead}><span style={S.specEmoji}>{(SPEC_META[s]||{}).e||"\u2B50"}</span><span style={S.specName}>{s}</span><span style={S.specCount}>{who.length}</span></div>
                    {(SPEC_META[s]||{}).d && <div style={S.specDesc}>{SPEC_META[s].d}</div>}
                    <div style={S.specWho}>{who.map(m=>(<span key={m} style={S.specMon}><Spr m={m} sz={18}/>{m}</span>))}</div>
                  </div>
                ))}
                {missing.length>0 && <div style={S.missingBox}><b style={{color:"#7d8a7e"}}>Not covered {specScope==="area"?"here":"yet"}:</b> {missing.join(", ")}</div>}
              </React.Fragment>);
            })()}
          </section>
        ) : A.special ? (
          <section style={{...S.section,background:A.tint,borderColor:A.accent+"33"}}>
            <div style={{...S.areaTitle,color:A.accent}}>{A.name}</div>
            <div style={S.subtle}>Obtained through events / special encounters — tap to mark befriended.</div>
            <div style={S.palette}>
              {A.mon.map(m=>(
                <button key={m} onClick={()=>toggleExtra(m)} className="tapchip"
                  style={{...S.pchip,...(isBef(m)?{background:A.accent,borderColor:A.accent,color:"#fff"}:{background:"#fff",borderColor:A.accent+"44"})}}>
                  <Spr m={m}/><span style={S.pname}>{m}</span>{isBef(m)?<Check size={12} strokeWidth={3}/>:null}
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section style={{...S.section,background:A.tint,borderColor:A.accent+"33"}}>
            <div style={{...S.areaTitle,color:A.accent}}>{A.name}</div>

            <div style={S.zoneLabel}><Leaf size={13} color={A.accent}/> Habitats <span style={S.zc}>{areaIds.length}</span></div>
            <div style={S.tileGrid}>
              {areaIds.map(id=>{ const habN=insts[id].hab; const occ=occByInst[id]; const dup=countByHab(habN)>1; return (
                <div key={id} className="drop" style={{...S.tile, borderColor:occ?A.accent:"#e0e7df"}}
                  onDragOver={e=>e.preventDefault()} onDrop={e=>{const m=e.dataTransfer.getData("mon"); if(m) moveToInstance(m,id);}}
                  onClick={()=>setSheet({type:"tile",id})}>
                  <img src={HAB_IMG(habN)} alt="" loading="lazy" referrerPolicy="no-referrer" style={S.tileImg} onError={e=>{e.currentTarget.style.display="none";}}/>
                  <div style={S.tileName}>#{habN} {HAB_INFO[habN].name}{dup?<span style={S.dupTag}><Copy size={9}/> dup</span>:null}</div>
                  {occ ? (<div style={S.tileOcc}><Spr m={occ} sz={22}/><span style={{fontWeight:700,fontSize:12}}>{occ}</span></div>)
                       : (<div style={S.tileEmpty}>empty · tap to fill</div>)}
                </div>
              );})}
              <button style={S.addTile} onClick={()=>setSheet({type:"addHab"})}><Plus size={18}/><span>Add habitat</span></button>
            </div>

            <div style={S.zoneLabel}><Home size={13} color={A.accent}/> Houses <span style={S.zc}>{areaHouses.length}</span></div>
            <div className="drop" style={S.houseBin} onDragOver={e=>e.preventDefault()} onDrop={e=>{const m=e.dataTransfer.getData("mon"); if(m) addHouse(m,area);}}>
              {areaHouses.map(m=>(
                <button key={m} onClick={()=>setSheet({type:"poke",mon:m})} className="tapchip" style={{...S.pchip,background:"#fff",borderColor:A.accent+"44"}}>
                  <Spr m={m}/><span style={S.pname}>{m}</span>
                </button>
              ))}
              <button style={S.addHouse} onClick={()=>setSheet({type:"addHouse"})}><Plus size={16}/> Add</button>
            </div>

            <div style={S.zoneLabel}><Target size={13} color={A.accent}/> Recommended here — still to get <span style={S.zc}>{recPalette.length}</span></div>
            <div style={S.palette}>
              {recPalette.map(m=>(
                <button key={m} draggable onDragStart={e=>e.dataTransfer.setData("mon",m)} onClick={()=>setSheet({type:"place",mon:m})}
                  className="tapchip" style={{...S.pchip,background:"#fff",borderColor:A.accent+"33"}}>
                  <Spr m={m}/><span style={S.pname}>{m}</span>
                </button>
              ))}
              <button style={S.addAny} onClick={()=>setSheet({type:"addAny"})}><Search size={14}/> Any Pokémon…</button>
            </div>
          </section>
        )}

        <footer style={S.footer}>
          Tap a recommended Pokémon to build the habitat it spawns from, or drop it into a house. Each habitat tile is one built instance — add the same habitat twice to track two of them independently. Placed anywhere = befriended. Lists are recommendations only; “Any Pokémon” puts anyone anywhere. Saves automatically on this device.
          <div style={{marginTop:9,paddingTop:9,borderTop:"1px solid #e7ece5",color:"#a4b0a5"}}>Pokopia Tracker <b style={{color:"#7d8a7e"}}>{VERSION}</b> · built {BUILD} · made with <b style={{color:"#7d8a7e"}}>Claude</b> (Anthropic)</div>
        </footer>
      </div>

      {sheet && <Sheet sheet={sheet} area={area} A={A} pQuery={pQuery} setPQuery={setPQuery} onClose={()=>setSheet(null)}
        insts={insts} occByInst={occByInst} isBef={isBef} countByHab={countByHab}
        actions={{addInstance,removeInstance,setOccupant,clearOccupant,addHouse,moveToInstance,buildAndOccupy,unplace}}/>}
    </div>
  );
}

function Spr({m,sz=20}){ const u=SPRITE_URL(m); if(!u) return null; return <img src={u} alt="" loading="lazy" referrerPolicy="no-referrer" style={{width:sz,height:sz,objectFit:"contain",flexShrink:0}} onError={e=>{e.currentTarget.style.visibility="hidden";}}/>; }

function Sheet({sheet,area,A,pQuery,setPQuery,onClose,insts,occByInst,isBef,countByHab,actions}){
  const q=pQuery.trim().toLowerCase();
  const allPoke=Object.keys(SPRITE_ID);
  const areaIdsOf=(habN)=> Object.keys(insts).filter(id=>insts[id].area===area && insts[id].hab===+habN);
  let title="", node=null;

  if(sheet.type==="addHab"){
    title="Add a habitat to "+A.short;
    const list=Object.keys(HAB_INFO).map(Number)
      .filter(n=>!q || HAB_INFO[n].name.toLowerCase().includes(q) || ("#"+n).includes(q))
      .sort((a,b)=> (HAB_AREA[b]===area)-(HAB_AREA[a]===area) || a-b);
    node=(<div style={SB.list}>
      {list.slice(0,300).map(n=>{ const c=countByHab(n); return (
        <button key={n} style={SB.row} onClick={()=>{actions.addInstance(n,area); onClose();}}>
          <img src={HAB_IMG(n)} alt="" referrerPolicy="no-referrer" style={{width:38,height:28,objectFit:"contain"}} onError={e=>{e.currentTarget.style.display="none";}}/>
          <div style={{flex:1,textAlign:"left",minWidth:0}}><div style={{fontWeight:700,fontSize:13}}>#{n} {HAB_INFO[n].name}</div><div style={{fontSize:11,color:"#8a958b",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{HAB_INFO[n].req}</div></div>
          {c>0? <span style={SB.tag}>built ×{c}</span>:null}
        </button>);})}
    </div>);
  } else if(sheet.type==="tile"){
    const id=sheet.id; const habN=insts[id]?insts[id].hab:null; const occ=occByInst[id];
    if(habN==null){ node=<div style={SB.hint}>This habitat was removed.</div>; }
    else { title=`#${habN} ${HAB_INFO[habN].name}`;
      node=(<div>
        <div style={SB.reqLine}>{HAB_INFO[habN].req}</div>
        <div style={SB.sectlabel}>Who lives here?</div>
        <div style={SB.list}>
          {(HAB_SPAWNS[habN]||[]).map(s=>(
            <button key={s.mon} style={{...SB.row,...(occ===s.mon?SB.rowOn:{})}} onClick={()=>{actions.setOccupant(id,s.mon); onClose();}}>
              <Spr m={s.mon} sz={24}/><span style={{flex:1,textAlign:"left",fontWeight:600}}>{s.mon}</span>
              {isBef(s.mon)&&occ!==s.mon?<span style={SB.tag}>caught</span>:null}{occ===s.mon?<Check size={15} strokeWidth={3} color="#3E9A60"/>:null}
            </button>
          ))}
        </div>
        <div style={SB.actionRow}>
          {occ && <button style={SB.ghost} onClick={()=>{actions.clearOccupant(id); onClose();}}><Leaf size={13}/> Mark empty</button>}
          <button style={SB.danger} onClick={()=>{actions.removeInstance(id); onClose();}}><Trash2 size={13}/> Remove this habitat</button>
        </div>
      </div>); }
  } else if(sheet.type==="addHouse" || sheet.type==="addAny"){
    const any=sheet.type==="addAny";
    title=any? "Add any Pokémon to "+A.short : "Add a house resident — "+A.short;
    const base=any? allPoke : A.mon;
    const list=base.filter(m=>!q||m.toLowerCase().includes(q));
    node=(<div style={SB.list}>
      {list.slice(0,300).map(m=>(<button key={m} style={{...SB.row,...(isBef(m)?SB.rowDim:{})}} onClick={()=>{actions.addHouse(m,area); onClose();}}>
        <Spr m={m} sz={24}/><span style={{flex:1,textAlign:"left",fontWeight:600}}>{m}</span>{isBef(m)?<span style={SB.tag}>caught</span>:null}</button>))}
      {list.length===0 && <div style={SB.hint}>No matches.</div>}
    </div>);
  } else if(sheet.type==="place"){
    const m=sheet.mon; title=m;
    const habs=HABITAT_DATA[m]||[];
    const reqCount=(r)=> (r? r.split(",").length : 99);
    const rank={empty:0,unbuilt:1,occupied:2};
    const ann=habs.map(h=>{ const ids=areaIdsOf(h.n); const emptyIds=ids.filter(id=>!occByInst[id]);
      const st=emptyIds.length?"empty":(ids.length?"occupied":"unbuilt");
      const occ=ids.length? occByInst[ids.find(id=>occByInst[id])] : null;
      return {...h, ids, emptyIds, st, occ}; })
      .sort((a,b)=> rank[a.st]-rank[b.st] || reqCount(a.req)-reqCount(b.req) || a.n-b.n);
    node=(<div>
      {habs.length? <div style={SB.sectlabel}>Where does {m} live? Tap a habitat — it's built here if you haven't already</div>
                  : <div style={SB.hint}>{m} doesn't come from a habitat (event / story). House it below if caught.</div>}
      <div style={SB.list}>
        {ann.map((h,i)=>(
          <div key={h.n} style={{...SB.row,...(h.st==="empty"?SB.rowOn:{}),cursor:"pointer"}}
            onClick={()=>{actions.buildAndOccupy(h.n,m,area); onClose();}}>
            <img src={HAB_IMG(h.n)} alt="" referrerPolicy="no-referrer" style={{width:38,height:28,objectFit:"contain",flexShrink:0}} onError={e=>{e.currentTarget.style.display="none";}}/>
            <div style={{flex:1,minWidth:0,textAlign:"left"}}>
              <div style={{fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>#{h.n} {HAB_INFO[h.n].name}{i===0? <span style={SB.rec}>Recommended</span>:null}</div>
              <div style={{fontSize:11,color:"#8a958b"}}>{h.req}{h.cond?` · ${h.cond}`:""}</div>
            </div>
            {h.st==="empty" && <span style={{...SB.tag,color:"#1E9AAE",background:"#dcf0f1"}}>Place here</span>}
            {h.st==="unbuilt" && <span style={{...SB.tag,color:"#3E9A60",background:"#E0F1E5"}}>Build &amp; place</span>}
            {h.st==="occupied" && <span style={{...SB.tag,color:"#9a5c3e",background:"#F4E9DA"}}>+1 &amp; place</span>}
          </div>
        ))}
      </div>
      <div style={SB.actionRow}><button style={SB.primary} onClick={()=>{actions.addHouse(m,area); onClose();}}><Home size={14}/> Caught it — house here</button></div>
    </div>);
  } else if(sheet.type==="poke"){
    const m=sheet.mon; title=m;
    const ids=Object.keys(insts).filter(id=>insts[id].area===area).sort((a,b)=>insts[a].hab-insts[b].hab);
    node=(<div>
      <div style={SB.sectlabel}>Move to a habitat here</div>
      <div style={SB.list}>
        {ids.length===0 && <div style={SB.hint}>No habitats built here yet.</div>}
        {ids.map(id=>{ const habN=insts[id].hab; const occ=occByInst[id]; return (
          <button key={id} style={SB.row} onClick={()=>{actions.moveToInstance(m,id); onClose();}}>
            <img src={HAB_IMG(habN)} alt="" referrerPolicy="no-referrer" style={{width:34,height:26,objectFit:"contain"}} onError={e=>{e.currentTarget.style.display="none";}}/>
            <span style={{flex:1,textAlign:"left",fontWeight:600}}>#{habN} {HAB_INFO[habN].name}</span>{occ&&occ!==m?<span style={SB.tag}>has {occ}</span>:null}</button>);})}
      </div>
      <div style={SB.actionRow}><button style={SB.danger} onClick={()=>{actions.unplace(m); onClose();}}><Trash2 size={13}/> Remove (not caught)</button></div>
    </div>);
  }

  return (
    <div style={SB.overlay} onClick={onClose}>
      <div style={SB.sheet} onClick={e=>e.stopPropagation()}>
        <div style={SB.head}><span style={SB.title}>{title}</span><button style={SB.close} onClick={onClose}><X size={16}/></button></div>
        {(sheet.type==="addHab"||sheet.type==="addHouse"||sheet.type==="addAny") &&
          <div style={SB.search}><Search size={15} color="#9aa79b"/><input autoFocus style={SB.searchIn} placeholder="Search…" value={pQuery} onChange={e=>setPQuery(e.target.value)}/></div>}
        <div style={SB.body}>{node}</div>
      </div>
    </div>
  );
}

function RecGroup({icon,label,rows,render,empty,all,more}){
  const shown=all?rows:rows.slice(0,5);
  return (<div style={{marginTop:12}}>
    <div style={S.recGroupLabel}>{icon} {label}</div>
    {rows.length===0? <div style={S.recEmpty}>{empty}</div> :
      <div style={{display:"flex",flexDirection:"column",gap:7}}>{shown.map((r,i)=><React.Fragment key={(r.id||r.n)+"-"+i}>{render(r)}</React.Fragment>)}</div>}
    {rows.length>5 && <button style={S.moreBtn} onClick={more}>{all?"Show fewer":`Show all ${rows.length}`}</button>}
  </div>);
}
function MoveLine({n,miss,kind,occ}){
  return (<div style={{...S.moveRow,background:kind==="ready"?"#E5F4F5":"#FBF6EE",borderColor:kind==="ready"?"#cfe9eb":"#F0E2CC"}}>
    <img src={HAB_IMG(n)} alt="" loading="lazy" referrerPolicy="no-referrer" style={S.moveImg} onError={e=>{e.currentTarget.style.display="none";}}/>
    <div style={{minWidth:0,flex:1}}>
      <div style={S.moveName}><span style={{color:"#9aa79b",fontWeight:700}}>#{n}</span> {HAB_INFO[n].name}{kind==="free"&&<span style={S.occTag}><Home size={10}/> {occ}</span>}</div>
      <div style={{fontSize:12.5,marginTop:3}}><span style={{color:"#7d8a7e"}}>{kind==="free"?"move occupant out → ":"can roll → "}</span><span style={{color:"#3E9A60",fontWeight:700}}>{miss.slice(0,6).join(", ")}{miss.length>6?` +${miss.length-6}`:""}</span></div>
    </div>
  </div>);
}
function BuildLine({n,miss,another}){
  return (<div style={S.buildRow}>
    <img src={HAB_IMG(n)} alt="" loading="lazy" referrerPolicy="no-referrer" style={S.buildImg} onError={e=>{e.currentTarget.style.display="none";}}/>
    <div style={{minWidth:0,flex:1}}>
      <div style={S.buildName}><span style={{color:"#9aa79b",fontWeight:700}}>#{n}</span> {HAB_INFO[n].name} <span style={S.countPill}>{miss.length} new</span>{another?<span style={S.anotherPill}>build another</span>:null}</div>
      <div style={S.buildReq}>{HAB_INFO[n].req}</div>
      <div style={{fontSize:12,color:"#5b6b5d",marginTop:4}}>{miss.slice(0,8).join(", ")}{miss.length>8?` +${miss.length-8}`:""}</div>
    </div>
  </div>);
}

const FONT='ui-rounded, "SF Pro Rounded", "Segoe UI", "Nunito", system-ui, -apple-system, sans-serif';
const S={
  page:{fontFamily:FONT,background:"#F4F6F2",minHeight:"100vh",padding:"22px 14px",color:"#2f3a30"},
  shell:{maxWidth:960,margin:"0 auto"},
  header:{marginBottom:14},
  h1:{fontSize:24,fontWeight:800,margin:0,letterSpacing:-0.5},
  ver:{fontSize:11,fontWeight:800,color:"#8a958b",background:"#eef2ec",borderRadius:20,padding:"2px 8px",letterSpacing:0.2},
  iconBtn:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:34,height:34,borderRadius:10,border:"1px solid #dbe2da",background:"#fff",color:"#5b6b5d",cursor:"pointer"},
  progressWrap:{marginTop:14,background:"#fff",border:"1px solid #e4ebe2",borderRadius:16,padding:"13px 16px"},
  progressTop:{fontSize:15,display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"},
  pctPill:{fontSize:12.5,fontWeight:700,color:"#3E9A60",background:"#E0F1E5",borderRadius:20,padding:"2px 9px"},
  habStat:{marginLeft:"auto",display:"inline-flex",alignItems:"center",gap:4,fontSize:12,fontWeight:700,color:"#8a958b"},
  bar:{height:9,background:"#eef2ec",borderRadius:20,overflow:"hidden",marginTop:9},
  barFill:{height:"100%",background:"linear-gradient(90deg,#5fb87e,#3E9A60)",borderRadius:20,transition:"width .35s ease"},
  recCard:{background:"#fff",border:"1px solid #e4ebe2",borderRadius:16,marginBottom:16,overflow:"hidden"},
  recHead:{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,background:"transparent",border:"none",cursor:"pointer",padding:"13px 15px",fontFamily:FONT},
  recTitle:{fontSize:15.5,fontWeight:800},
  recSub:{fontSize:11.5,color:"#9aa79b",fontWeight:600},
  recGroupLabel:{display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:800,color:"#5b6b5d",margin:"0 0 7px"},
  recEmpty:{fontSize:12,color:"#9aa79b",background:"#f7faf6",border:"1px dashed #dde6dc",borderRadius:10,padding:"8px 11px"},
  moveRow:{display:"flex",gap:10,alignItems:"flex-start",border:"1px solid",borderRadius:11,padding:"8px 10px"},
  moveImg:{width:44,height:34,objectFit:"contain",borderRadius:6,background:"#eef3ec",flexShrink:0},
  moveName:{fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"},
  occTag:{display:"inline-flex",alignItems:"center",gap:3,fontSize:11,fontWeight:700,color:"#9a5c3e",background:"#F0E2CC",borderRadius:20,padding:"1px 7px"},
  buildRow:{display:"flex",gap:11,alignItems:"flex-start",background:"#F7FAF6",border:"1px solid #e4ebe2",borderRadius:11,padding:"9px 11px"},
  buildImg:{width:48,height:38,objectFit:"contain",borderRadius:7,background:"#eef3ec",flexShrink:0},
  buildName:{fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"},
  countPill:{fontSize:10.5,fontWeight:800,color:"#3E9A60",background:"#E0F1E5",borderRadius:20,padding:"1px 8px"},
  anotherPill:{fontSize:10,fontWeight:800,color:"#9a5c3e",background:"#F4E9DA",borderRadius:20,padding:"1px 8px"},
  buildReq:{fontSize:11.5,color:"#7d8a7e",marginTop:2},
  moreBtn:{marginTop:9,fontFamily:FONT,fontSize:12.5,fontWeight:700,color:"#3E9A60",background:"#E0F1E5",border:"none",borderRadius:10,padding:"7px 12px",cursor:"pointer",width:"100%"},
  pills:{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14,position:"sticky",top:0,background:"#F4F6F2",padding:"4px 0",zIndex:5},
  pill:{fontFamily:FONT,fontSize:12.5,fontWeight:700,padding:"7px 13px",borderRadius:20,border:"1px solid",background:"#fff",cursor:"pointer",whiteSpace:"nowrap"},
  viewToggle:{display:"flex",gap:6,background:"#eef2ec",borderRadius:12,padding:4,width:"fit-content",marginBottom:14},
  vtBtn:{fontFamily:FONT,fontSize:13,fontWeight:700,padding:"7px 16px",borderRadius:9,border:"none",background:"transparent",color:"#7d8a7e",cursor:"pointer"},
  vtOn:{background:"#fff",color:"#2f3a30",boxShadow:"0 1px 4px rgba(0,0,0,.08)"},
  scopeRow:{display:"flex",gap:6,marginBottom:12},
  scopeBtn:{fontFamily:FONT,fontSize:12,fontWeight:700,padding:"5px 12px",borderRadius:20,border:"1px solid #dbe2da",background:"#fff",color:"#5b6b5d",cursor:"pointer"},
  scopeOn:{background:"#3a463b",color:"#fff",borderColor:"#3a463b"},
  specCard:{background:"#fff",border:"1px solid #e7ece5",borderRadius:13,padding:"11px 13px",marginBottom:9},
  specHead:{display:"flex",alignItems:"center",gap:8},
  specEmoji:{fontSize:19,lineHeight:1},
  specName:{fontSize:14.5,fontWeight:800,color:"#2f3a30"},
  specCount:{marginLeft:"auto",fontSize:11.5,fontWeight:700,color:"#8a958b",background:"#f1f4f0",borderRadius:20,padding:"1px 9px"},
  specDesc:{fontSize:12,color:"#7d8a7e",marginTop:3,lineHeight:1.4},
  specWho:{display:"flex",flexWrap:"wrap",gap:6,marginTop:9},
  specMon:{display:"inline-flex",alignItems:"center",gap:4,fontSize:12,fontWeight:600,color:"#3a463b",background:"#f3f6f1",border:"1px solid #e7ece5",borderRadius:20,padding:"2px 9px 2px 4px"},
  missingBox:{fontSize:12,color:"#9aa79b",lineHeight:1.5,background:"#f7faf6",border:"1px dashed #dde6dc",borderRadius:10,padding:"9px 12px",marginTop:4},
  section:{border:"1px solid",borderRadius:18,padding:"14px 15px 16px",marginBottom:16},
  areaTitle:{fontSize:19,fontWeight:800,letterSpacing:-0.3,marginBottom:10},
  subtle:{fontSize:12.5,color:"#8a958b",marginBottom:10},
  zoneLabel:{display:"flex",alignItems:"center",gap:6,fontSize:12.5,fontWeight:800,color:"#5b6b5d",margin:"14px 0 8px"},
  zc:{fontSize:11,fontWeight:700,color:"#9aa79b",background:"rgba(255,255,255,.7)",borderRadius:20,padding:"1px 8px"},
  tileGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:9},
  tile:{background:"#fff",border:"1.5px solid",borderRadius:13,padding:"9px 10px",cursor:"pointer",textAlign:"left"},
  tileImg:{width:"100%",height:56,objectFit:"contain",borderRadius:7,background:"#f3f6f1"},
  tileName:{fontSize:12,fontWeight:700,marginTop:6,lineHeight:1.2,display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"},
  dupTag:{display:"inline-flex",alignItems:"center",gap:2,fontSize:9.5,fontWeight:800,color:"#9a5c3e",background:"#F4E9DA",borderRadius:20,padding:"0 6px"},
  tileOcc:{display:"flex",alignItems:"center",gap:6,marginTop:7,background:"#f3f6f1",borderRadius:8,padding:"4px 7px"},
  tileEmpty:{fontSize:11.5,color:"#a4b0a5",marginTop:7,fontStyle:"italic"},
  addTile:{border:"1.5px dashed #cdd6cc",borderRadius:13,background:"rgba(255,255,255,.5)",color:"#5b6b5d",fontFamily:FONT,fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,minHeight:110},
  houseBin:{display:"flex",flexWrap:"wrap",gap:7,background:"rgba(255,255,255,.5)",border:"1.5px dashed #d7dfd6",borderRadius:12,padding:10,minHeight:44,alignItems:"center"},
  addHouse:{display:"inline-flex",alignItems:"center",gap:4,fontFamily:FONT,fontSize:12,fontWeight:700,color:"#5b6b5d",background:"#fff",border:"1px solid #dbe2da",borderRadius:20,padding:"6px 11px",cursor:"pointer"},
  palette:{display:"flex",flexWrap:"wrap",gap:7,marginTop:2},
  pchip:{display:"inline-flex",alignItems:"center",gap:5,fontFamily:FONT,fontSize:12.5,fontWeight:600,border:"1.5px solid",borderRadius:20,padding:"4px 10px 4px 5px",cursor:"pointer"},
  pname:{maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},
  addAny:{display:"inline-flex",alignItems:"center",gap:5,fontFamily:FONT,fontSize:12,fontWeight:700,color:"#3E9A60",background:"#E0F1E5",border:"none",borderRadius:20,padding:"6px 12px",cursor:"pointer"},
  footer:{fontSize:12,color:"#9aa79b",lineHeight:1.6,marginTop:8,padding:"0 4px 30px"},
};
const SB={
  overlay:{position:"fixed",inset:0,background:"rgba(30,40,32,.42)",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",boxSizing:"border-box",zIndex:100},
  sheet:{background:"#fff",width:"100%",maxWidth:520,borderRadius:18,maxHeight:"80vh",display:"flex",flexDirection:"column",boxShadow:"0 12px 48px rgba(0,0,0,.28)"},
  head:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px 8px"},
  title:{fontSize:15.5,fontWeight:800,color:"#2f3a30"},
  close:{border:"none",background:"#f1f4f0",borderRadius:8,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#5b6b5d"},
  search:{display:"flex",alignItems:"center",gap:8,margin:"0 16px 6px",background:"#f3f6f1",borderRadius:11,padding:"9px 12px"},
  searchIn:{border:"none",outline:"none",background:"transparent",fontFamily:FONT,fontSize:14,flex:1},
  body:{overflowY:"auto",padding:"6px 12px 20px"},
  list:{display:"flex",flexDirection:"column",gap:4},
  row:{display:"flex",alignItems:"center",gap:10,width:"100%",background:"#fff",border:"1px solid #eef1ec",borderRadius:10,padding:"9px 11px",cursor:"pointer",fontFamily:FONT,fontSize:13.5,color:"#2f3a30"},
  rowOn:{background:"#E0F1E5",borderColor:"#bfe3cb"},
  rowDim:{opacity:.55},
  tag:{fontSize:10.5,fontWeight:700,color:"#8a958b",background:"#f1f4f0",borderRadius:20,padding:"1px 7px"},
  rec:{fontSize:10,fontWeight:800,color:"#B9743A",background:"#F4E9DA",borderRadius:20,padding:"1px 7px"},
  sectlabel:{fontSize:11.5,fontWeight:800,color:"#8a958b",textTransform:"uppercase",letterSpacing:.4,margin:"8px 2px 6px"},
  reqLine:{fontSize:12.5,color:"#7d8a7e",margin:"2px 2px 4px"},
  hint:{fontSize:12.5,color:"#9aa79b",padding:"8px 4px",lineHeight:1.4},
  actionRow:{display:"flex",gap:8,flexWrap:"wrap",marginTop:12},
  primary:{display:"inline-flex",alignItems:"center",gap:6,fontFamily:FONT,fontSize:13,fontWeight:700,color:"#fff",background:"#3E9A60",border:"none",borderRadius:10,padding:"9px 14px",cursor:"pointer"},
  ghost:{display:"inline-flex",alignItems:"center",gap:6,fontFamily:FONT,fontSize:13,fontWeight:700,color:"#5b6b5d",background:"#f3f6f1",border:"1px solid #e0e7df",borderRadius:10,padding:"9px 13px",cursor:"pointer"},
  danger:{display:"inline-flex",alignItems:"center",gap:6,fontFamily:FONT,fontSize:13,fontWeight:700,color:"#b04a3a",background:"#fbece9",border:"1px solid #f2d4cd",borderRadius:10,padding:"9px 13px",cursor:"pointer"},
};
const CSS=`
  .tapchip:active{transform:scale(.96);}
  .tapchip{transition:transform .07s ease;}
  button{-webkit-tap-highlight-color:transparent;}
  @media (prefers-reduced-motion:reduce){ .tapchip{transition:none;} }
`;
