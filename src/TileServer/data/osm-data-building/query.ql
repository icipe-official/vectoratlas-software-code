/*
This has been generated by the overpass-turbo wizard.
The original search was:
"lake"
*/
[out:json];
// gather results
(
  relation["natural"="water"](if: length() > 50000)(-35.8, 9.3, -4.5, 51.1);
);
// print results
out body;
>;
out skel qt;