/*
This has been generated by the overpass-turbo wizard.
The original search was:
"lake"
*/
[out:json];
// gather results
(
  relation["natural"="water"](if: length() > 50000)(18.65, -19.5, 35.82, 55.46);
);
// print results
out body;
>;
out skel qt;