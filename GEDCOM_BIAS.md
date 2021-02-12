# GEDCOM Cultural Bias

Okay, there's some debate as to _whether technology can be biased_, or is it just some thing that anyone can use in any way.

This debate isn't useful for GEDCOM. It's so transparently biased that there's no argument. It allows exactly two (2) gender values. It defines families as strictly between a "male" and "female" partner. It supports the full range of LDS sacraments, many Christian and Jewish rituals, and no religious events for any other religious practice. Though it is switching to Unicode, it previously adopted ANSEL, a character set that had no mechanism for representing names in non-Western scripts.

GEDCOM continues to be developed by the Church of Jesus Christ of Latter-day Saints, which has [bigoted views of homosexuality](https://en.wikipedia.org/wiki/Homosexuality_and_The_Church_of_Jesus_Christ_of_Latter-day_Saints), so it's unlikely that these things will change.

There are alternative formats like [Gramps XML](https://www.gramps-project.org/wiki/index.php/Gramps_XML), which appear to be superior and suffer from fewer cultural biases, but are much less popular. GEDCOM is, for now, the exchange format, and this parser project is meant to work with it, potentially converting it to other formats and forms.
