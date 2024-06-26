from setuptools import setup, find_packages

with open('requirements.txt') as f:
    required = f.read().splitlines()
    
long_description = "This Mazer Maker Solver made entirely in Python is a program where you can generate maze with many different algorithm and solving them with different pathfinders. Nothing more, nothing less. More info at https://github.com/Pietot/Lapyrinth"
    
setup(
    name="lapyrinth",
    version="1.13",
    packages=find_packages(),
    install_requires=required,
    author="Piétôt",
    author_email="baptiste.blasquez@gmail.com",
    maintainer="Piétôt",
    description="A program capable of creating mazes with many different algorithms and solving them with different pathfinders.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/Pietot/Lapyrinth",
    keywords=["maze", "pathfinding", "algorithm", "labyrinth", "pathfinder", "maze generator"],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.10",
)
