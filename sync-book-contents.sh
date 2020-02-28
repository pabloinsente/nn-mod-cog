# remove jupyter notebook checkpoints
rm -rf ./notebooks/.ipynb_checkpoints/ 
# sync notebooks/ with book contents/
rsync -avzh ./notebooks/ ../../jupyter-books/com-cog-book-files/com-cog-book-contents/content/features/ 
